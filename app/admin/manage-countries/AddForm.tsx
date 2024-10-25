"use client";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { ICountry, ICountrySchema } from "@/lib/schemas/country";

interface AddFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddForm({ setIsOpen }: AddFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const initialValues = { uid: "", name: "" };
  const [formValues, setFormValues] = useState<ICountry>(initialValues);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICountry>({
    resolver: zodResolver(ICountrySchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: async () =>
      await axios.post(`/api/countries`, { data: formValues }),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Added Successfully!",
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

  const onSubmit = async (values: ICountry) => {
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
}
