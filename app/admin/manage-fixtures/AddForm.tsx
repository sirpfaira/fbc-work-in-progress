"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { BFixture, BFixtureSchema, IFixture } from "@/lib/schemas/fixture";
import { fixtureStatus } from "@/lib/constants";
import DateTimePicker from "@/app/components/common/DateTimePicker";

const teamOptions = [
  { value: 100, label: "Arsenal" },
  { value: 105, label: "Leeds" },
  { value: 119, label: "Brighton" },
  { value: 189, label: "Liverpool" },
  { value: 190, label: "Manchester City" },
];

const competitionOptions = [
  { value: 100, label: "EPL" },
  { value: 105, label: "UCL" },
  { value: 119, label: "Laliga" },
  { value: 189, label: "Seria A" },
];

interface AddFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddForm({ setIsOpen }: AddFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formValues, setFormValues] = useState<IFixture | null>(null);

  const form = useForm<BFixture>({
    resolver: zodResolver(BFixtureSchema),
    mode: "onBlur",
  });

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: async () => await axios.post(`/api/fixtures`, formValues),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["fixtures"] });
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
    try {
      const competitionName = competitionOptions.find(
        (i) => i.value == values.competition
      )?.label;
      const homeTeamName = teamOptions.find(
        (i) => i.value == values.homeTeam
      )?.label;
      const awayTeamName = teamOptions.find(
        (i) => i.value == values.awayTeam
      )?.label;
      const newItem: IFixture = {
        ...values,
        date: values.date?.toISOString(),
        competitionName: competitionName!,
        teams: `${homeTeamName} v ${awayTeamName}`,
        scores: {
          tenMinutes: "",
          halfTime: "",
          fullTime: "",
          extraTime: "",
          penalties: "",
        },
        corners: {
          halfTime: "",
          fullTime: "",
        },
        bookings: {
          halfTime: "",
          fullTime: "",
        },
        odds: [],
      };
      setFormValues(newItem);
      addItem();
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(newItem, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
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
                <FormMessage>{form.formState.errors.uid.message}</FormMessage>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <FormItem>
              <FormLabel>Competition</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a competition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {competitionOptions.map((item) => (
                    <SelectItem key={item.value} value={String(item.value)}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.competition && (
                <FormMessage>
                  {form.formState.errors.competition.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="homeTeam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Team</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select home team" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teamOptions.map((item) => (
                    <SelectItem key={item.value} value={String(item.value)}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.homeTeam && (
                <FormMessage>
                  {form.formState.errors.homeTeam.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="awayTeam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Away Team</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select away team" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teamOptions.map((item) => (
                    <SelectItem key={item.value} value={String(item.value)}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.awayTeam && (
                <FormMessage>
                  {form.formState.errors.awayTeam.message}
                </FormMessage>
              )}
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
  );
}
