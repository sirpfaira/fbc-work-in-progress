"use client";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import axios from "axios";
import { TPlatform } from "@/lib/schemas/platform";
import ErrorTile from "@/app/components/common/ErrorTile";
import FormSkeleton from "@/app/components/common/LoadingSkeletons";
import Link from "next/link";
import PageTitle from "@/app/components/common/PageTitle";
import { Trash2 } from "lucide-react";

// const placeholder = {
//   _id: new mongoose.Types.ObjectId(),
//   uid: "",
//   markets: [],
// };

export default function EditForm() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["platforms"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/platforms`);
      return data.items as TPlatform[];
    },
  });

  if (isError) return <ErrorTile error={error.message} />;

  const params = useParams();
  const { _id } = params;

  const current = data?.find((item) => item._id.toString() === _id);

  return (
    <>
      {isLoading ? (
        <FormSkeleton rows={2} />
      ) : (
        <>
          {current && data ? (
            <EditFields item={current} platforms={data} />
          ) : (
            <ErrorTile error={`Platform with id ${_id} was not found!`} />
          )}
        </>
      )}
    </>
  );
}

interface EditFieldsProps {
  item: TPlatform;
  platforms: TPlatform[];
}

const EditFields = ({ item, platforms }: EditFieldsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState<TPlatform>(item);

  const { mutate: editItem, isPending } = useMutation({
    mutationFn: async () =>
      await axios.put(`/api/platforms/${item._id}`, newItem),
    onSuccess: (response: any) => {
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({
        queryKey: ["platforms"],
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

  const handleSubmit = () => {
    // validate with zod
    editItem();
  };

  function handleAddMarket() {
    // validate with zod
    // add to state
  }

  return (
    <div className="grid w-full lg:grid-cols-[520px_1fr] gap-8">
      <div className="flex flex-col space-y-4">
        <div className="card flex items-center justify-between px-3 py-2">
          <PageTitle title={item.uid} link="/admin/manage-platforms" />
        </div>
        <div className="flex flex-col space-y-3  p-3 card">
          <div className="w-full flex items-center space-x-3">
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="_id">
                Market Id
              </label>
              <Input type="text" id="_id" />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="name">
                Market name
              </label>
              <Input type="text" id="name" />
            </div>
          </div>
          <div className="flex">
            <Button variant={"outline"} onClick={handleAddMarket}>
              Add market
            </Button>
          </div>
        </div>
        <div className="flex flex-col p-3 card ">
          <span className="text-big font-medium border-b border-border">
            Markets
          </span>
          <div className="flex flex-col space-y-3 divide-y divide-border">
            {newItem.markets.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center pt-3"
              >
                <span className="">{`${item._id}: ${item.name}`}</span>
                <Trash2 size={16} className="text-destructive" />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex justify-end items-center space-x-3 p-3 card">
          <Button disabled={isPending} onClick={handleSubmit}>
            Submit
          </Button>
          <Link
            href={`admin/manage-platforms`}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
        </div>
      </div>
      <div className="hidden lg:flex card p-6">Sidebar</div>
    </div>
  );
};
