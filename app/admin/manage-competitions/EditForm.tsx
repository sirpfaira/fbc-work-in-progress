"use client";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
  ICompetition,
  ICompetitionSchema,
  TCompetition,
} from "@/lib/schemas/competition";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import FormSkeleton from "@/app/components/common/LoadingSkeletons";
import { getSeasonOptions } from "@/lib/helpers/competition";
import { TCountry } from "@/lib/schemas/country";

interface EditFormProps {
  itemId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditForm({ itemId, setIsOpen }: EditFormProps) {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["competition", { itemId }],
    queryFn: async () => {
      const { data } = await axios.get(`/api/competitions/${itemId}`);
      const { item } = data;
      delete item._id;
      return item as ICompetition;
    },
  });

  if (isError) return <ErrorsTile errors={[error.message]} />;

  return (
    <>
      {isLoading ? (
        <FormSkeleton rows={2} />
      ) : (
        <>
          {data && (
            <EditFields itemId={itemId} item={data} setIsOpen={setIsOpen} />
          )}
        </>
      )}
    </>
  );
}

interface EditFieldsProps {
  itemId: string;
  item: ICompetition;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const EditFields = ({ itemId, item, setIsOpen }: EditFieldsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/countries`);
      return data.items as TCountry[];
    },
  });

  const { data: competitions } = useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/competitions`);
      return data.items as TCompetition[];
    },
  });

  const form = useForm<ICompetition>({
    resolver: zodResolver(ICompetitionSchema),
    defaultValues: item,
    mode: "onBlur",
  });

  const { mutate: editItem, isPending } = useMutation({
    mutationFn: async (competition: ICompetition) =>
      await axios.put(`/api/competitions/${itemId}`, competition),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({
        queryKey: ["competitions"],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["competition", { itemId }],
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

  const onSubmit = async (values: ICompetition) => {
    if (item.uid !== values.uid) {
      const uidExists = competitions?.find((i) => i.uid === values.uid);
      if (uidExists) {
        toast({
          title: "Error!",
          description: "Competition with that uid already exists!",
          variant: "destructive",
        });
        return;
      }
    }
    editItem(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="uid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Competition UID</FormLabel>
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Competition name</FormLabel>
              <FormControl>
                <Input placeholder="Premier League" {...field} />
              </FormControl>
              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="season"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Competition season</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a season" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getSeasonOptions().map((item) => (
                    <SelectItem key={item} value={String(item)}>
                      {item}
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
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl className="mx-auto">
                <Input
                  type="number"
                  placeholder="Priority"
                  {...field}
                  className="w-[97%]"
                />
              </FormControl>
              {form.formState.errors.priority && (
                <FormMessage>
                  {form.formState.errors.priority.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Competition country</FormLabel>
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
                        ? countries?.find((item) => item.uid === field.value)
                            ?.name
                        : "Select country"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search market..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries
                          ?.sort((a, b) =>
                            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
                          )
                          ?.map((item) => (
                            <CommandItem
                              value={`${item.name}|${item.uid}`}
                              key={item.uid}
                              onSelect={() => {
                                form.setValue("country", item.uid);
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
  );
};
