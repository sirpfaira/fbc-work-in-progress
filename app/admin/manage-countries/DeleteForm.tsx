"use client";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import axios from "axios";

interface DeleteFormProps {
  itemId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteForm({ itemId, setIsOpen }: DeleteFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: deleteItem, isPending } = useMutation({
    mutationFn: async () => await axios.delete(`/api/countries/${itemId}`),
    onSuccess: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
    onError: (response: any) => {
      toast({
        title: "Error!",
        description: response?.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="w-full grid grid-cols-2 gap-4">
      <Button
        size="lg"
        variant="outline"
        disabled={isPending}
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </Button>
      <Button
        size="lg"
        onClick={() => deleteItem()}
        isLoading={isPending}
        disabled={isPending}
        variant="destructive"
      >
        Delete
      </Button>
    </div>
  );
}
