"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IOddSelector, IOddSelectorSchema } from "@/lib/schemas/oddselector";

interface AddFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddForm({ setIsOpen }: AddFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const initialValues = { uid: 100, apiId: 100, name: "", alias: "" };
  const [formValues, setFormValues] = useState<IOddSelector>(initialValues);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IOddSelector>({
    resolver: zodResolver(IOddSelectorSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: async () => await axios.post(`/api/oddselectors`, formValues),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["oddselectors"] });
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
    console.log(values);
    try {
      setFormValues(values);
      addItem();
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
          <Input
            id="uid"
            type="text"
            {...register("uid", {
              valueAsNumber: true,
            })}
          />

          {errors?.uid && (
            <small className="text-destructive">{errors.uid?.message}</small>
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
            <small className="text-destructive">{errors.apiId?.message}</small>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-medium block" htmlFor="name">
            Name
          </label>
          <Input id="name" type="text" {...register("name")} />

          {errors?.name && (
            <small className="text-destructive">{errors.name?.message}</small>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-medium block" htmlFor="alias">
            Alias(es)
          </label>
          <Input id="alias" type="text" {...register("alias")} />

          {errors?.alias && (
            <small className="text-destructive">{errors.alias?.message}</small>
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
}