"use client";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
import { TPunter } from "@/lib/schemas/punter";
import ErrorTile from "@/app/components/common/ErrorTile";
import FormSkeleton from "@/app/components/common/LoadingSkeletons";
import { BFullDummy, BFullDummySchema, TDummy } from "@/lib/schemas/dummy";
import { TCountry } from "@/lib/schemas/country";
import { TPlatform } from "@/lib/schemas/platform";

interface ApiResult {
  dummy: TDummy;
  punter: TPunter;
}

interface EditFormProps {
  itemId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditForm({ itemId, setIsOpen }: EditFormProps) {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["dummy", { itemId }],
    queryFn: async () => {
      const { data } = await axios.get(`/api/dummies/${itemId}`);
      const { item } = data;
      return item as ApiResult;
    },
  });

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/countries`);
      return data.items as TCountry[];
    },
  });

  const { data: platforms } = useQuery({
    queryKey: ["platforms"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/platforms`);
      return data.items as TPlatform[];
    },
  });

  if (isError) return <ErrorTile error={error.message} />;

  return (
    <>
      {isLoading ? (
        <FormSkeleton rows={2} />
      ) : (
        <>
          {data && countries && platforms && (
            <EditFields
              itemId={itemId}
              item={data}
              countries={countries}
              platforms={platforms}
              setIsOpen={setIsOpen}
            />
          )}
        </>
      )}
    </>
  );
}

interface EditFieldsProps {
  itemId: string;
  item: ApiResult;
  countries: TCountry[];
  platforms: TPlatform[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function getBFullDummy(data: ApiResult) {
  return {
    username: data.punter.username,
    name: data.punter.name,
    country: data.punter.country,
    platform: data.punter.platform,
    realname: data.dummy.realname,
    url: data.dummy.url,
    special: data.dummy.special,
  };
}

const EditFields = ({
  itemId,
  item,
  countries,
  platforms,
  setIsOpen,
}: EditFieldsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fullDummy: BFullDummy = getBFullDummy(item);

  const form = useForm<BFullDummy>({
    resolver: zodResolver(BFullDummySchema),
    defaultValues: fullDummy,
    mode: "onBlur",
  });

  const { mutate: editItem, isPending } = useMutation({
    mutationFn: async (dummy: BFullDummy) =>
      await axios.put(`/api/dummies/${itemId}`, dummy),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({
        queryKey: ["dummies"],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["punters"],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["dummy", { itemId }],
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

  const onSubmit = async (values: BFullDummy) => {
    editItem(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User name</FormLabel>
              <FormControl>
                <Input placeholder="@username" {...field} />
              </FormControl>
              {form.formState.errors.username && (
                <FormMessage>
                  {form.formState.errors.username.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>

              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {platforms.map((item) => (
                    <SelectItem key={item.uid} value={item.uid}>
                      {item.uid.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.platform && (
                <FormMessage>
                  {form.formState.errors.platform.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((item) => (
                    <SelectItem key={item.uid} value={item.uid}>
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
          name="realname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Real name</FormLabel>
              <FormControl>
                <Input placeholder="Real Name" {...field} />
              </FormControl>
              {form.formState.errors.realname && (
                <FormMessage>
                  {form.formState.errors.realname.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="url" {...field} />
              </FormControl>
              {form.formState.errors.url && (
                <FormMessage>{form.formState.errors.url.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="special"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special</FormLabel>
              <FormControl>
                <Input placeholder="special" {...field} />
              </FormControl>
              {form.formState.errors.special && (
                <FormMessage>
                  {form.formState.errors.special.message}
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
};
