"use client";
import React, { Dispatch, SetStateAction } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  BFixture,
  BFixtureSchema,
  IFixture,
  TFixture,
} from "@/lib/schemas/fixture";
import { fixtureStatus } from "@/lib/constants";
import DateTimePicker from "@/app/components/common/DateTimePicker";
import { TCompetition } from "@/lib/schemas/competition";
import { FormSkeleton } from "@/app/components/common/LoadingSkeletons";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import { TTeam } from "@/lib/schemas/team";

interface AddFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddForm({ setIsOpen }: AddFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/teams`);
      return data.items as TTeam[];
    },
  });

  const { data: fixtures } = useQuery({
    queryKey: ["all-fixtures"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/fixtures?filter=all`);
      return data.items as TFixture[];
    },
  });

  const form = useForm<BFixture>({
    resolver: zodResolver(BFixtureSchema),
    mode: "onBlur",
  });

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: async (fixture: IFixture) =>
      await axios.post(`/api/fixtures`, fixture),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["fixtures"], exact: true });
    },
    onError: (response: any) => {
      toast({
        title: "Error!",
        description: response?.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: BFixture) => {
    const uidExists = fixtures?.find((i) => i.uid === values.uid);
    if (uidExists) {
      toast({
        title: "Error!",
        description: "Fixture with that uid already exists!",
        variant: "destructive",
      });
      return;
    }
    const competitionName = competitions?.find(
      (i) => i.uid == values.competition
    )?.name;
    const homeTeamName = teams?.find((i) => i.uid == values.homeTeam)?.name;
    const awayTeamName = teams?.find((i) => i.uid == values.awayTeam)?.name;
    const newItem: IFixture = {
      ...values,
      date: values.date?.toISOString(),
      competitionName: competitionName!,
      teams: `${homeTeamName} v ${awayTeamName}`,
      scores: {
        tenMinutes: null,
        halfTime: null,
        fullTime: null,
        extraTime: null,
        penalties: null,
      },
      corners: {
        halfTime: null,
        fullTime: null,
      },
      bookings: {
        halfTime: null,
        fullTime: null,
      },
      odds: [],
    };
    addItem(newItem);
  };

  if (isError) return <ErrorsTile errors={[error.message]} />;

  return (
    <>
      {isLoading ? (
        <FormSkeleton rows={1} />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="uid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fixture UID</FormLabel>
                  <FormControl className="mx-auto">
                    <Input
                      type="number"
                      placeholder="UID"
                      {...field}
                      className="w-[97%]"
                    />
                  </FormControl>
                  {form.formState.errors.uid && (
                    <FormMessage>
                      {form.formState.errors.uid.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fixture date</FormLabel>
                  <DateTimePicker setDate={field.onChange} date={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fixtureStatus.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.status && (
                    <FormMessage>
                      {form.formState.errors.status.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="competition"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Competition</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? competitions?.find(
                                (item) => item.uid === field.value
                              )?.name
                            : "Select competition"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search competition..." />
                        <CommandList>
                          <CommandEmpty>No competition found.</CommandEmpty>
                          <CommandGroup>
                            {competitions
                              ?.sort((a, b) =>
                                a.name > b.name ? 1 : b.name > a.name ? -1 : 0
                              )
                              ?.map((item) => (
                                <CommandItem
                                  value={`${item.name}|${item.uid}`}
                                  key={item.uid}
                                  onSelect={() => {
                                    form.setValue("competition", item.uid);
                                  }}
                                >
                                  {item.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      item.uid === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="homeTeam"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Home Team</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? teams?.find((item) => item.uid === field.value)
                                ?.name
                            : "Select home team"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search team..." />
                        <CommandList>
                          <CommandEmpty>No team found.</CommandEmpty>
                          <CommandGroup>
                            {teams
                              ?.sort((a, b) =>
                                a.name > b.name ? 1 : b.name > a.name ? -1 : 0
                              )
                              ?.map((item) => (
                                <CommandItem
                                  value={`${item.name}|${item.uid}`}
                                  key={item.uid}
                                  onSelect={() => {
                                    form.setValue("homeTeam", item.uid);
                                  }}
                                >
                                  {item.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      item.uid === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="awayTeam"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Away Team</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? teams?.find((item) => item.uid === field.value)
                                ?.name
                            : "Select away team"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search team..." />
                        <CommandList>
                          <CommandEmpty>No team found.</CommandEmpty>
                          <CommandGroup>
                            {teams
                              ?.sort((a, b) =>
                                a.name > b.name ? 1 : b.name > a.name ? -1 : 0
                              )
                              ?.map((item) => (
                                <CommandItem
                                  value={`${item.name}|${item.uid}`}
                                  key={item.uid}
                                  onSelect={() => {
                                    form.setValue("awayTeam", item.uid);
                                  }}
                                >
                                  {item.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      item.uid === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-center items-center space-x-3 pt-3">
              <Button
                variant="outline"
                type="button"
                disabled={isPending}
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isPending}
                disabled={isPending}
                className="w-full"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
