"use client";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
        title: "Deleted!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
    onError: (response: any) => {
      setIsOpen(false);
      toast({
        title: "Error!",
        description: response?.message,
        variant: "destructive",
      });
      console.log(response);
    },
  });

  return (
    <div className="w-full flex justify-center space-x-3">
      <Button
        size="lg"
        variant="outline"
        disabled={isPending}
        className="w-full"
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </Button>
      <Button
        size="lg"
        onClick={() => deleteItem()}
        disabled={isPending}
        className="w-full bg-red-500 hover:bg-red-400"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deleting
          </>
        ) : (
          <span>Delete</span>
        )}
      </Button>
    </div>
  );
}
