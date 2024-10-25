"use client";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { TCountry, ICountrySchema } from "@/lib/schemas/country";
import ErrorTile from "@/app/components/common/ErrorTile";
import FormSkeleton from "@/app/components/common/FormSkeleton";

interface EditFormProps {
  itemId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditForm({ itemId, setIsOpen }: EditFormProps) {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["country", { itemId }],
    queryFn: async () => {
      const { data } = await axios.get(`/api/countries/${itemId}`);
      return data.item as TCountry;
    },
  });

  if (isError) return <ErrorTile error={error.message} />;

  return (
    <>
      {isLoading ? (
        <FormSkeleton rows={2} />
      ) : (
        <>{data && <EditFields item={data} setIsOpen={setIsOpen} />}</>
      )}
    </>
  );
}

interface EditFieldsProps {
  item: TCountry;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const EditFields = ({ item, setIsOpen }: EditFieldsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<TCountry>(item);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCountry>({
    resolver: zodResolver(ICountrySchema),
    defaultValues: item,
    mode: "onBlur",
  });

  const { mutate: editItem, isPending } = useMutation({
    mutationFn: async () =>
      await axios.put(`/api/countries/${formValues._id}`, { data: formValues }),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Updated successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
    onError: (response: any) => {
      // setIsOpen(false);
      toast({
        title: "Error!",
        description: response?.message,
        variant: "destructive",
      });
      console.log(response);
    },
  });

  const onSubmit = async (values: TCountry) => {
    console.log(values);
    try {
      setFormValues(values);
      editItem();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block mb-1" htmlFor="uid">
            UID
          </label>
          <Input type="text" {...register("uid")} />
          <div className="h-8">
            {errors?.uid && (
              <small className="text-red-400">{errors.uid?.message}</small>
            )}
          </div>
        </div>
        <div>
          <label className="block " htmlFor="name">
            Name
          </label>
          <Input type="text" {...register("name")} />
          <div className="h-8">
            {errors?.name && (
              <small className="text-red-400">{errors.name?.message}</small>
            )}
          </div>
        </div>
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
          <Button type="submit" disabled={isPending} className="w-full">
            <>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </>
          </Button>
        </div>
      </div>
    </form>
  );
};
