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
import { IMarketSchema, IFixtureMarket, TFixture } from "@/lib/schemas/fixture";
import ErrorTile from "@/app/components/common/ErrorTile";
import FormSkeleton from "@/app/components/common/LoadingSkeletons";
import PageTitle from "@/app/components/common/PageTitle";
import CustomDialog from "@/app/components/common/CustomDialog";

export default function EditForm() {
  const params = useParams();
  const { _id } = params;
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["fixtures"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/fixtures`);
      return data.items as TFixture[];
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
            <EditFields item={current} fixtures={data} />
          ) : (
            <ErrorTile error={`Fixture with id ${_id} was not found!`} />
          )}
        </>
      )}
    </>
  );
}

interface EditFieldsProps {
  item: TFixture;
  fixtures: TFixture[];
}

const EditFields = ({ item, fixtures }: EditFieldsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState<TFixture>(item);
  const [fixtureToClone, setFixtureToClone] = useState<string>("");
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [isAddMarketOpen, setIsAddMarketOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFixtureMarket>({
    resolver: zodResolver(IMarketSchema),
    defaultValues: { _id: 1, name: "" },
    mode: "onBlur",
  });

  const { mutate: editItem, isPending } = useMutation({
    mutationFn: async () =>
      await axios.put(`/api/fixtures/${item._id}`, newItem),
    onSuccess: (response: any) => {
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({
        queryKey: ["fixtures"],
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

  function handleAddMarket(data: IFixtureMarket) {
    reset();
    const item = newItem.markets.find((i) => i._id == data._id);
    if (item) {
      const newMarkets = newItem.markets.map((market) => {
        if (market._id == data._id) {
          return data;
        } else {
          return market;
        }
      });
      setNewItem({ ...newItem, markets: newMarkets });
    } else {
      const newMarkets = [data, ...newItem.markets];
      setNewItem({ ...newItem, markets: newMarkets });
    }
    setIsAddMarketOpen(false);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  function handleEditMarket(item: IFixtureMarket) {
    reset(item);
    setIsAddMarketOpen(true);
  }

  function handleCloneFixture() {
    const fixture = fixtures.find((p) => p.uid === fixtureToClone);
    if (fixture) {
      const newMarkets = [...newItem.markets];
      fixture.markets.map((pItem) => {
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

  function deleteAllItemMarkets() {
    setNewItem({ ...newItem, markets: [] });
    setIsDeleteAllOpen(false);
  }

  return (
    <div className="grid w-full lg:grid-cols-[520px_1fr] gap-8">
      <div className="flex flex-col space-y-4">
        <div className="card flex items-center justify-between px-3 py-2">
          <PageTitle title={item.uid} link="/admin/manage-fixtures" />
        </div>
        <div className="flex justify-between p-3 card ">
          <div className="flex space-x-2">
            <Button
              variant={"outline"}
              disabled={newItem.markets.length < 1}
              onClick={() => setIsAddMarketOpen(true)}
            >
              Add market
            </Button>
            <Button
              variant={"outline"}
              disabled={newItem.markets.length < 1}
              onClick={() => setIsDeleteAllOpen(true)}
            >
              Delete all
            </Button>
          </div>

          <div className="flex space-x-2">
            <Select
              value={fixtureToClone}
              onValueChange={(e) => setFixtureToClone(e)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select fixture" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fixtures</SelectLabel>
                  {fixtures
                    .filter((i) => i.uid !== newItem.uid)
                    .map((item) => (
                      <SelectItem key={item.uid} value={item.uid}>
                        {item.uid}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              variant={"outline"}
              disabled={!fixtureToClone}
              onClick={handleCloneFixture}
            >
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
          <Button
            disabled={isPending}
            isLoading={isPending}
            onClick={handleSaveToDatabase}
          >
            Submit
          </Button>
          <Link
            href={`/admin/manage-fixtures`}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
        </div>
        <CustomDialog
          isOpen={isAddMarketOpen}
          setIsOpen={setIsAddMarketOpen}
          title="Add market"
          description="Add a new market to your fixture"
        >
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
                <Button
                  variant="outline"
                  type="button"
                  disabled={isPending}
                  className="w-full"
                  onClick={() => setIsAddMarketOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </CustomDialog>
        <CustomDialog
          isOpen={isDeleteAllOpen}
          setIsOpen={setIsDeleteAllOpen}
          title="Delete All Items"
          description="Are you sure you want to delete all items?"
        >
          <div className="w-full grid grid-cols-2 gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsDeleteAllOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={deleteAllItemMarkets}
              variant="destructive"
            >
              Delete all
            </Button>
          </div>
        </CustomDialog>
      </div>
      <div className="hidden lg:flex card p-6">Sidebar</div>
    </div>
  );
};