"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { IPlatform, IPlatformSchema } from "@/lib/schemas/platform";
import ErrorTile from "@/app/components/common/ErrorTile";
import FormSkeleton from "@/app/components/common/LoadingSkeletons";

interface EditFormProps {
  itemId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditForm({ itemId, setIsOpen }: EditFormProps) {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["platform", { itemId }],
    queryFn: async () => {
      const { data } = await axios.get(`/api/platforms/${itemId}`);
      const { item } = data;
      delete item._id;
      return item as IPlatform;
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
  item: IPlatform;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const EditFields = ({ itemId, item, setIsOpen }: EditFieldsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<IPlatform>(item);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPlatform>({
    resolver: zodResolver(IPlatformSchema),
    defaultValues: item,
    mode: "onBlur",
  });

  const { mutate: editItem, isPending } = useMutation({
    mutationFn: async () =>
      await axios.put(`/api/platforms/${itemId}`, formValues),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({
        queryKey: ["platforms"],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["platform", { itemId }],
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

  const onSubmit = async (values: IPlatform) => {
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
        <div className="flex flex-col space-y-1">
          <label className="font-medium block" htmlFor="uid">
            UID
          </label>
          <Input type="text" {...register("uid")} />

          {errors?.uid && (
            <small className="text-destructive">{errors.uid?.message}</small>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-medium block" htmlFor="name">
            Name
          </label>
          <Input type="text" {...register("name")} />

          {errors?.name && (
            <small className="text-destructive">{errors.name?.message}</small>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-medium block" htmlFor="country">
            Country
          </label>
          <Input type="text" {...register("country")} />

          {errors?.country && (
            <small className="text-destructive">
              {errors.country?.message}
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
  );
};
