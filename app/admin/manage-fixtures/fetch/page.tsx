"use client";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  BLeagueSchema,
  BLeague,
  ILeague,
  IFixture,
} from "@/lib/schemas/fixture";
import ErrorTile from "@/app/components/common/ErrorTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import PageTitle from "@/app/components/common/PageTitle";
import { TCompetition } from "@/lib/schemas/competition";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const initialData = { league: 0, date: new Date() };

export default function FetchFixtures() {
  const { toast } = useToast();
  // const queryClient = useQueryClient();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchedFixtures, setFetchedFixtures] = useState<IFixture[]>([]);

  const {
    data: competitions,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/competitions`);
      return data.items as TCompetition[];
    },
  });

  const { mutate: fetchLeagueFixtures, isPending } = useMutation({
    mutationFn: async (league: ILeague) =>
      await axios.post(`/api/sports-api/fixtures`, league),
    onSuccess: (response: any) => {
      const matches = response.data.items as IFixture[];
      toast({
        title: "Success",
        description: "Successfully fetched fixtures!",
      });
      setFetchedFixtures(matches);
    },
    onError: (response: any) => {
      setFetchError(response?.message);
    },
  });

  const form = useForm<BLeague>({
    resolver: zodResolver(BLeagueSchema),
    mode: "onBlur",
    defaultValues: initialData,
  });

  const onSubmit = (values: BLeague) => {
    const newDate = values.date;
    newDate.setHours(values.date.getHours() + 4);
    const leagueToFetch: ILeague = {
      uid: values.competition,
      date: format(newDate, "yyy-MM-dd"),
      season:
        competitions?.find((item) => item.uid == values.competition)?.season ||
        new Date().getFullYear(),
    };
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-full rounded-md bg-muted-block p-4">
    //       <code className="text-sky-600">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    setFetchError(null);
    fetchLeagueFixtures(leagueToFetch);
  };

  if (isError) return <ErrorTile error={error.message} />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Fetch fixtures" link="/admin/manage-fixtures" />
      </div>
      {isLoading ? (
        <TableSkeleton columns={2} />
      ) : (
        <>
          {competitions && (
            <div className="grid w-full lg:grid-cols-[520px_1fr] gap-8">
              <div className="flex flex-col space-y-5 w-full">
                <Dialog open={isPending}>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogDescription>
                        <div className="flex space-x-1 items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Fetching fixtures from the Sports API!</span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <div className="flex flex-col w-full">
                  <div className="flex flex-col space-y-5 card p-4 w-full">
                    <div className="border border-border px-4 rounded-md">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            <span className="text-big font-medium w-full text-start">
                              Information
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <Form {...form}>
                              <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="w-full space-y-6"
                              >
                                <FormField
                                  control={form.control}
                                  name="competition"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Competition</FormLabel>
                                      <Select
                                        onValueChange={(value) =>
                                          field.onChange(Number(value))
                                        }
                                        defaultValue={String(field.value)}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a competition" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {competitions?.map((item) => (
                                            <SelectItem
                                              key={item.uid}
                                              value={String(item.uid)}
                                            >
                                              {item.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      {form.formState.errors.competition && (
                                        <FormMessage>
                                          {
                                            form.formState.errors.competition
                                              .message
                                          }
                                        </FormMessage>
                                      )}
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="date"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                      <FormLabel>Start Date</FormLabel>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <FormControl>
                                            <Button
                                              variant={"outline"}
                                              className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value &&
                                                  "text-muted-foreground"
                                              )}
                                            >
                                              {field.value ? (
                                                format(field.value, "PPP")
                                              ) : (
                                                <span>Pick a date</span>
                                              )}
                                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                          </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto p-0"
                                          align="start"
                                        >
                                          <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                              date > new Date() ||
                                              date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="w-full flex justify-center items-center space-x-3 pt-3">
                                  <Button
                                    variant="outline"
                                    type="submit"
                                    className="w-full"
                                  >
                                    Fetch
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </div>

                {fetchError && <ErrorTile error={fetchError} />}
                {fetchedFixtures.length > 0 && (
                  <div className="flex flex-col space-y-5 card p-4 w-full">
                    {fetchedFixtures.map((item) => (
                      <div
                        key={item.uid}
                        className="flex flex-col border border-border px-4 rounded-md"
                      >
                        <span>{item.uid}</span>
                        <span>{item.teams}</span>
                        <span>{item.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="hidden lg:flex flex-col">
                <div className="flex flex-col space-y-5 card p-4 w-full">
                  <span>Sidebar</span>
                  {/* <pre className="mt-2 w-full rounded-md bg-muted-block p-4">
                  <code className="text-sky-600">
                    {JSON.stringify(league, null, 2)}
                  </code>
                </pre> */}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
