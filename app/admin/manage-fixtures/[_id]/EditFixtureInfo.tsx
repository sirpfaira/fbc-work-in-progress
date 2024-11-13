"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  BFixture,
  BFixtureSchema,
  IFixture,
  IFixtureInfo,
} from "@/lib/schemas/fixture";
import { SquarePen } from "lucide-react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DateTimePicker from "@/app/components/common/DateTimePicker";
import CustomDialog from "@/app/components/common/CustomDialog";
import { fixtureStatus } from "@/lib/constants";

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

interface EditFixtureInfoProps {
  updateFixtureInfo: (values: IFixtureInfo) => void;
  item: IFixture;
}

export default function EditFixtureInfo({
  updateFixtureInfo,
  item,
}: EditFixtureInfoProps) {
  const [isEditFixtureInfoOpen, setIsEditFixtureInfoOpen] =
    useState<boolean>(false);

  const initialValues: BFixture = {
    uid: item.uid,
    date: new Date(item.date),
    status: item.status,
    competition: item.competition,
    homeTeam: item.homeTeam,
    awayTeam: item.awayTeam,
  };

  const form = useForm<BFixture>({
    resolver: zodResolver(BFixtureSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const onSubmit = async (values: BFixture) => {
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
      const newItem: IFixtureInfo = {
        ...values,
        date: values.date?.toISOString(),
        competitionName: competitionName!,
        teams: `${homeTeamName} v ${awayTeamName}`,
      };
      updateFixtureInfo(newItem);
      setIsEditFixtureInfoOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center">
      <button
        className="text-rating-top border border-border rounded-md p-1"
        onClick={() => setIsEditFixtureInfoOpen(true)}
      >
        <SquarePen size={14} />
      </button>
      <CustomDialog
        isOpen={isEditFixtureInfoOpen}
        setIsOpen={setIsEditFixtureInfoOpen}
        title="Edit fixture Info"
        description="Add a fixture to the database"
      >
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
                className="w-full"
                onClick={() => setIsEditFixtureInfoOpen(false)}
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
    </div>
  );
}
