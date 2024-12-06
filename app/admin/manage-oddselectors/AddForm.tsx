"use client";
import React, { Dispatch, SetStateAction } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  IOddSelector,
  IOddSelectorSchema,
  TOddSelector,
} from "@/lib/schemas/oddselector";
import ErrorTile from "@/app/components/common/ErrorTile";
import { FormSkeleton } from "@/app/components/common/LoadingSkeletons";

interface AddFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddForm({ setIsOpen }: AddFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: oddselectors,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["oddselectors"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/oddselectors`);
      return data.items as TOddSelector[];
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IOddSelector>({
    resolver: zodResolver(IOddSelectorSchema),
    mode: "onBlur",
  });

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: async (oddselector: IOddSelector) =>
      await axios.post(`/api/oddselectors`, oddselector),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({
        queryKey: ["oddselectors"],
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

  const onSubmit = async (values: IOddSelector) => {
    const uidExists = oddselectors?.find((i) => i.uid === values.uid);
    if (uidExists) {
      toast({
        title: "Error!",
        description: "Odd selector with that uid already exists!",
        variant: "destructive",
      });
      return;
    }
    addItem(values);
  };

  if (isError) return <ErrorTile error={error.message} />;

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
              <Input
                id="uid"
                type="text"
                {...register("uid", {
                  valueAsNumber: true,
                })}
              />

              {errors?.uid && (
                <small className="text-destructive">
                  {errors.uid?.message}
                </small>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="apiId">
                API ID
              </label>
              <Input
                id="apiId"
                type="text"
                {...register("apiId", {
                  valueAsNumber: true,
                })}
              />
              {errors?.apiId && (
                <small className="text-destructive">
                  {errors.apiId?.message}
                </small>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="name">
                Name
              </label>
              <Input id="name" type="text" {...register("name")} />

              {errors?.name && (
                <small className="text-destructive">
                  {errors.name?.message}
                </small>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="alias">
                Alias(es)
              </label>
              <Input id="alias" type="text" {...register("alias")} />

              {errors?.alias && (
                <small className="text-destructive">
                  {errors.alias?.message}
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
