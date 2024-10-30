"use client";
import { useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SquarePen, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IMarketSchema,
  IPlatformMarket,
  TPlatform,
} from "@/lib/schemas/platform";
import ErrorTile from "@/app/components/common/ErrorTile";
import FormSkeleton from "@/app/components/common/LoadingSkeletons";
import PageTitle from "@/app/components/common/PageTitle";

export default function EditForm() {
  const params = useParams();
  const { _id } = params;
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["platforms"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/platforms`);
      return data.items as TPlatform[];
    },
  });

  if (isError) return <ErrorTile error={error.message} />;
  const current = data?.find((item) => item._id.toString() === _id);

  return (
    <>
      {isLoading ? (
        <FormSkeleton rows={2} />
      ) : (
        <>
          {current && data ? (
            <EditFields item={current} platforms={data} />
          ) : (
            <ErrorTile error={`Platform with id ${_id} was not found!`} />
          )}
        </>
      )}
    </>
  );
}

interface EditFieldsProps {
  item: TPlatform;
  platforms: TPlatform[];
}

const EditFields = ({ item, platforms }: EditFieldsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState<TPlatform>(item);
  const [platformToClone, setPlatformToClone] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IPlatformMarket>({
    resolver: zodResolver(IMarketSchema),
    defaultValues: { _id: 1, name: "" },
    mode: "onBlur",
  });

  const { mutate: editItem, isPending } = useMutation({
    mutationFn: async () =>
      await axios.put(`/api/platforms/${item._id}`, newItem),
    onSuccess: (response: any) => {
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({
        queryKey: ["platforms"],
        exact: true,
      });
    },
    onError: (response: any) => {
      toast({
        title: "Error!",
        description: response?.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveToDatabase = () => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(newItem, null, 2)}</code>
        </pre>
      ),
    });
    editItem();
  };

  function handleDeleteMarket(id: number) {
    const newMarkets = newItem.markets.filter((item) => item._id !== id);
    setNewItem({ ...newItem, markets: newMarkets });
  }

  function handleAddMarket(data: IPlatformMarket) {
    const newMarkets = [data, ...newItem.markets];
    setNewItem({ ...newItem, markets: newMarkets });
    reset();
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  function handleEditMarket(item: IPlatformMarket) {
    handleDeleteMarket(item._id);
    reset(item);
  }

  function handleClonePlatform() {
    if (!platformToClone) {
      toast({
        title: "Error!",
        description: "Select a platform first",
      });
      return;
    }

    const platform = platforms.find((p) => p.uid === platformToClone);
    if (platform) {
      const newMarkets = [...newItem.markets];
      platform.markets.map((pItem) => {
        const newMarketItem = newItem.markets.find(
          (nItem) => nItem._id === pItem._id
        );
        if (!newMarketItem) {
          newMarkets.push(pItem);
        }
      });
      setNewItem({ ...newItem, markets: newMarkets });
    }
  }

  return (
    <div className="grid w-full lg:grid-cols-[520px_1fr] gap-8">
      <div className="flex flex-col space-y-4">
        <div className="card flex items-center justify-between px-3 py-2">
          <PageTitle title={item.uid} link="/admin/manage-platforms" />
        </div>
        <div className="flex flex-col px-3 card ">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="text-big font-semibold px-2">Add Market</span>
              </AccordionTrigger>
              <AccordionContent>
                <form
                  onSubmit={handleSubmit(handleAddMarket)}
                  className="flex flex-col space-y-3 p-2"
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-1">
                      <label className="font-medium block" htmlFor="_id">
                        Market Id
                      </label>
                      <Input
                        id="_id"
                        type="number"
                        {...register("_id", {
                          valueAsNumber: true,
                        })}
                      />
                      {errors?._id && (
                        <small className="text-destructive">
                          {errors._id?.message}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-medium block" htmlFor="name">
                        Name
                      </label>
                      <Input type="text" {...register("name")} />

                      {errors?.name && (
                        <small className="text-destructive">
                          {errors.name?.message}
                        </small>
                      )}
                    </div>
                    <div className="w-full flex items-center space-x-3">
                      <Button type="submit" variant={"outline"}>
                        Add market
                      </Button>
                    </div>
                  </div>
                </form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex justify-between p-3 card ">
          <Button
            variant={"outline"}
            onClick={() => setNewItem({ ...newItem, markets: [] })}
          >
            Delete all
          </Button>
          <div className="flex space-x-2">
            <Select
              value={platformToClone}
              onValueChange={(e) => setPlatformToClone(e)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Platforms</SelectLabel>
                  {platforms
                    .filter((i) => i.uid !== newItem.uid)
                    .map((item) => (
                      <SelectItem key={item.uid} value={item.uid}>
                        {item.uid}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant={"outline"} onClick={handleClonePlatform}>
              Clone
            </Button>
          </div>
        </div>

        <div className="flex flex-col px-3 card ">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="text-big font-medium">Markets</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-3 divide-y divide-border border border-border px-3 rounded-md">
                  {newItem.markets.length > 0 ? (
                    <>
                      {newItem.markets
                        .sort((a, b) => a._id - b._id)
                        .map((item) => (
                          <div
                            key={item._id}
                            className="flex justify-between items-center pt-3"
                          >
                            <span className="">{`${item._id}: ${item.name}`}</span>
                            <div>
                              <button
                                onClick={() => {
                                  handleEditMarket(item);
                                }}
                                className="text-rating-top rounded-md p-2 transition-all duration-75 hover:bg-muted-block"
                              >
                                <SquarePen size={16} />
                              </button>
                              <Button
                                onClick={() => handleDeleteMarket(item._id)}
                                variant={"ghost"}
                                className="rounded-md p-2 transition-all duration-75 hover:bg-muted-block"
                              >
                                <Trash2
                                  size={16}
                                  className="text-destructive"
                                />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </>
                  ) : (
                    <span className="py-3 ">No markets to show</span>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="w-full flex justify-end items-center space-x-3 p-3 card">
          <Button disabled={isPending} onClick={handleSaveToDatabase}>
            Submit
          </Button>
          <Link
            href={`admin/manage-platforms`}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
        </div>
      </div>
      <div className="hidden lg:flex card p-6">Sidebar</div>
    </div>
  );
};
