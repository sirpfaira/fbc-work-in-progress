"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ICompetition, ICompetitionSchema } from "@/lib/schemas/competition";

interface AddFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddForm({ setIsOpen }: AddFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const initialValues = {
    uid: "",
    name: "",
    season: 2023,
    priority: 1,
    country: "",
  };
  const [formValues, setFormValues] = useState<ICompetition>(initialValues);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICompetition>({
    resolver: zodResolver(ICompetitionSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: async () => await axios.post(`/api/competitions`, formValues),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
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
          <label className="font-medium block" htmlFor="season">
            Season
          </label>
          <Input
            type="number"
            {...register("season", {
              valueAsNumber: true,
            })}
          />

          {errors?.season && (
            <small className="text-destructive">{errors.season?.message}</small>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-medium block" htmlFor="priority">
            Priority
          </label>
          <Input
            type="number"
            {...register("priority", {
              valueAsNumber: true,
            })}
          />

          {errors?.priority && (
            <small className="text-destructive">
              {errors.priority?.message}
            </small>
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
}
