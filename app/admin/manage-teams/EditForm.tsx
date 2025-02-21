"use client";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { cn } from "@/lib/utils";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ITeam, ITeamSchema, TTeam } from "@/lib/schemas/team";
import ErrorTile from "@/app/components/common/ErrorTile";
import FormSkeleton from "@/app/components/common/LoadingSkeletons";
import { TCountry } from "@/lib/schemas/country";
import { Check, ChevronsUpDown } from "lucide-react";

interface EditFormProps {
  itemId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditForm({ itemId, setIsOpen }: EditFormProps) {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["team", { itemId }],
    queryFn: async () => {
      const { data } = await axios.get(`/api/teams/${itemId}`);
      const { item } = data;
      delete item._id;
      return item as ITeam;
    },
  });

  if (isError) return <ErrorTile error={error.message} />;

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
  item: ITeam;
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

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/teams`);
      return data.items as TTeam[];
    },
  });

  const form = useForm<ITeam>({
    resolver: zodResolver(ITeamSchema),
    defaultValues: item,
    mode: "onBlur",
  });

  const { mutate: editItem, isPending } = useMutation({
    mutationFn: async (team: ITeam) =>
      await axios.put(`/api/teams/${itemId}`, team),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({
        queryKey: ["teams"],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["team", { itemId }],
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

  const onSubmit = async (values: ITeam) => {
    if (item.uid !== values.uid) {
      const uidExists = teams?.find((i) => i.uid === values.uid);
      if (uidExists) {
        toast({
          title: "Error!",
          description: "Team with that uid already exists!",
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
              <FormLabel>Team UID</FormLabel>
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
              <FormLabel>Team name</FormLabel>
              <FormControl>
                <Input placeholder="Arsenal" {...field} />
              </FormControl>
              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Team country</FormLabel>
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
        <FormField
          control={form.control}
          name="alias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team alias</FormLabel>
              <FormControl>
                <Input placeholder="alias" {...field} />
              </FormControl>
              {form.formState.errors.alias && (
                <FormMessage>{form.formState.errors.alias.message}</FormMessage>
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
};
