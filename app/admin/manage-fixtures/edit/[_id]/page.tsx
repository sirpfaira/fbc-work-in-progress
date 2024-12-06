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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  IOddsSchema,
  IFixtureOdd,
  TFixture,
  IFixtureScores,
  ICornersBookings,
  IFixtureInfo,
} from "@/lib/schemas/fixture";
import ErrorTile from "@/app/components/common/ErrorTile";
import FormSkeleton from "@/app/components/common/LoadingSkeletons";
import PageTitle from "@/app/components/common/PageTitle";
import CustomDialog from "@/app/components/common/CustomDialog";
import EditScores from "./EditScores";
import EditCornersBookings from "./EditCornersBookings";
import TimeStamp from "@/app/components/common/TimeStamp";
import EditFixtureInfo from "./EditFixtureInfo";
import { TOddSelector } from "@/lib/schemas/oddselector";

export default function EditForm() {
  const params = useParams();
  const { _id } = params;
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["fixture", { _id }],
    queryFn: async () => {
      const { data } = await axios.get(`/api/fixtures/${_id}`);
      return data.item as TFixture;
    },
  });

  if (isError) return <ErrorTile error={error.message} />;

  return (
    <>
      {isLoading ? (
        <FormSkeleton rows={2} />
      ) : (
        <>
          {data ? (
            <EditFields item={data} />
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
}

const EditFields = ({ item }: EditFieldsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState<TFixture>(item);
  const [isDeleteAllOddsOpen, setIsDeleteAllOddsOpen] = useState(false);
  const [isAddOddOpen, setIsAddOddOpen] = useState<boolean>(false);
  const itemId = item._id;

  const { data: oddselectors } = useQuery({
    queryKey: ["oddselectors"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/oddselectors`);
      return data.items as TOddSelector[];
    },
  });

  const form = useForm<IFixtureOdd>({
    resolver: zodResolver(IOddsSchema),
    mode: "onBlur",
  });

  const { mutate: editItem, isPending } = useMutation({
    mutationFn: async (fixture: TFixture) =>
      await axios.put(`/api/fixtures/${itemId}`, fixture),
    onSuccess: (response: any) => {
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({
        queryKey: ["fixtures"],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["fixture", { itemId }],
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
    editItem(newItem);
  };

  function handleDeleteOdd(id: number) {
    const newOdds = newItem.odds.filter((item) => item._id !== id);
    setNewItem({ ...newItem, odds: newOdds });
  }

  function handleAddOdd(data: IFixtureOdd) {
    form.reset({
      value: 1,
      _id: 1,
    });
    const item = newItem.odds.find((i) => i._id == data._id);
    if (item) {
      const newOdds = newItem.odds.map((odd) => {
        if (odd._id == data._id) {
          return data;
        } else {
          return odd;
        }
      });
      setNewItem({ ...newItem, odds: newOdds });
    } else {
      const newOdds = [data, ...newItem.odds];
      setNewItem({ ...newItem, odds: newOdds });
    }
    setIsAddOddOpen(false);
  }

  function handleEditOdd(item: IFixtureOdd) {
    form.reset(item);
    setIsAddOddOpen(true);
  }

  function deleteAllItemOdds() {
    setNewItem({ ...newItem, odds: [] });
    setIsDeleteAllOddsOpen(false);
  }

  function updateScores(values: IFixtureScores) {
    setNewItem({ ...newItem, scores: values });
  }

  function updateCornersBookings(values: ICornersBookings) {
    setNewItem({
      ...newItem,
      corners: values.corners,
      bookings: values.bookings,
    });
  }

  function updateFixtureInfo(values: IFixtureInfo) {
    setNewItem({
      ...newItem,
      ...values,
    });
  }

  return (
    <div className="grid w-full lg:grid-cols-[520px_1fr] gap-8">
      <div className="flex flex-col space-y-4">
        <div className="card flex items-center justify-between px-3 py-2">
          <PageTitle title={newItem.teams} link="/admin/manage-fixtures" />
        </div>
        <div className="flex flex-col px-3 card">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex space-x-3 items-center">
                  <span className="text-big font-medium"> Fixture Info</span>
                  <EditFixtureInfo
                    updateFixtureInfo={updateFixtureInfo}
                    item={newItem}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col border border-border p-3 rounded-md">
                  <span>{newItem.teams}</span>
                  <span>{newItem.competitionName}</span>
                  <TimeStamp date={newItem.date} />
                  <span>{newItem.status}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col px-3 card">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex space-x-3 items-center">
                  <span className="text-big font-medium">Scores</span>
                  <EditScores
                    updateScores={updateScores}
                    item={newItem.scores}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-3 divide-y divide-border border border-border px-3 rounded-md">
                  <span>{`Ten Minutes: ${newItem.scores.tenMinutes}`}</span>
                  <span>{` Half Time: ${newItem.scores.halfTime}`}</span>
                  <span>{`Full Time: ${newItem.scores.fullTime}`}</span>
                  <span>{`Extra Time: ${newItem.scores.extraTime}`}</span>
                  <span>{`Penalties: ${newItem.scores.penalties}`}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col px-3 card">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex space-x-3 items-center">
                  <span className="text-big font-medium">
                    Corners & Bookings
                  </span>
                  <EditCornersBookings
                    updateCornersBookings={updateCornersBookings}
                    item={{
                      corners: newItem.corners,
                      bookings: newItem.bookings,
                    }}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-3 divide-y divide-border border border-border px-3 rounded-md">
                  <span>Corners</span>
                  <span>{` Half Time: ${newItem.corners.halfTime}`}</span>
                  <span>{`Full Time: ${newItem.corners.fullTime}`}</span>
                  <span>Bookings</span>
                  <span>{` Half Time: ${newItem.corners.halfTime}`}</span>
                  <span>{`Full Time: ${newItem.corners.fullTime}`}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col px-3 card">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="text-big font-medium">Odds</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-3 divide-y divide-border border border-border px-3 rounded-md">
                  <div className="flex space-x-2 pt-3">
                    <Button
                      variant={"outline"}
                      onClick={() => setIsAddOddOpen(true)}
                    >
                      Add odd
                    </Button>
                    <Button
                      variant={"outline"}
                      disabled={newItem.odds.length < 1}
                      onClick={() => setIsDeleteAllOddsOpen(true)}
                    >
                      Delete all
                    </Button>
                  </div>
                  {newItem.odds.length > 0 ? (
                    <>
                      {newItem.odds
                        .sort((a, b) => a._id - b._id)
                        .map((item) => (
                          <div
                            key={item._id}
                            className="flex justify-between items-center pt-3"
                          >
                            <span className="">{`${item._id}: ${item.value}`}</span>
                            <div>
                              <button
                                onClick={() => {
                                  handleEditOdd(item);
                                }}
                                className="text-rating-top rounded-md p-2 transition-all duration-75 hover:bg-muted-block"
                              >
                                <SquarePen size={16} />
                              </button>
                              <Button
                                onClick={() => handleDeleteOdd(item._id)}
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
                    <span className="py-3 ">No odds to show</span>
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
          isOpen={isAddOddOpen}
          setIsOpen={setIsAddOddOpen}
          title="Add odd"
          description="Add a new odd to your fixture"
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddOdd)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market UID</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a market" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {oddselectors?.map((item) => (
                          <SelectItem key={item.uid} value={String(item.uid)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1.1"
                        pattern="^\d*(\.\d{0,2})?$"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.value && (
                      <FormMessage>
                        {form.formState.errors.value.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <div className="w-full flex items-center space-x-3">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isPending}
                  className="w-full"
                  onClick={() => setIsAddOddOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CustomDialog>
        <CustomDialog
          isOpen={isDeleteAllOddsOpen}
          setIsOpen={setIsDeleteAllOddsOpen}
          title="Delete All Items"
          description="Are you sure you want to delete all items?"
        >
          <div className="w-full grid grid-cols-2 gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsDeleteAllOddsOpen(false)}
            >
              Cancel
            </Button>
            <Button size="lg" onClick={deleteAllItemOdds} variant="destructive">
              Delete all
            </Button>
          </div>
        </CustomDialog>
      </div>
      <div className="hidden lg:flex flex-col card p-6">
        <span>Sidebar</span>
        <pre className="mt-2 w-full rounded-md bg-muted-block p-4">
          <code className="text-sky-600">
            {JSON.stringify(newItem, null, 2)}
          </code>
        </pre>
      </div>
    </div>
  );
};
