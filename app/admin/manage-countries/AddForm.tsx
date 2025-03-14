"use client";
import React, { Dispatch, SetStateAction } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ICountry, ICountrySchema, TCountry } from "@/lib/schemas/country";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import { FormSkeleton } from "@/app/components/common/LoadingSkeletons";

interface AddFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddForm({ setIsOpen }: AddFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/countries`);
      return data.items as TCountry[];
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICountry>({
    resolver: zodResolver(ICountrySchema),
    mode: "onBlur",
  });

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: async (country: ICountry) =>
      await axios.post(`/api/countries`, country),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["countries"], exact: true });
    },
    onError: (response: any) => {
      toast({
        title: "Error!",
        description: response?.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: ICountry) => {
    const uidExists = data?.find((i) => i.uid === values.uid);
    if (uidExists) {
      toast({
        title: "Error!",
        description: "Country with that uid already exists!",
        variant: "destructive",
      });
      return;
    }
    addItem(values);
  };

  if (isError) return <ErrorsTile errors={[error.message]} />;

  return (
    <>
      {isLoading ? (
        <FormSkeleton rows={1} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="uid">
                UID
              </label>
              <Input type="text" {...register("uid")} />
              {errors?.uid && (
                <small className="text-destructive">
                  {errors.uid?.message}
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
          </div>
        </form>
      )}
    </>
  );
}
