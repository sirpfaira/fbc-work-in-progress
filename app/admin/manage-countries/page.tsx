"use client";
import { useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Columns from "./Columns";
import DataTable from "@/app/components/common/DataTable";
import { TCountry } from "@/lib/schemas/country";
import ErrorTile from "@/app/components/common/ErrorTile";
import TableSkeleton from "@/app/components/common/TableSkeleton";
import CustomDialog from "@/app/components/common/CustomDialog";
import AddForm from "./AddForm";
import { Button } from "@/components/ui/button";
import PageTitle from "@/app/components/common/PageTitle";

export default function ManageCountries() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/countries`);
      return data.items as TCountry[];
    },
  });

  const { mutate: deleteSelected, isPending } = useMutation({
    mutationFn: async () => await axios.patch(`/api/countries`, selectedRows),
    onSuccess: (response: any) => {
      toast({
        title: "Deleted successfully!",
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
      console.log(response);
    },
  });

  if (isError) return <ErrorTile error={error.message} />;

  return (
    <div className="flex flex-col space-y-5 p-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Manage countries" link="/admin" />
        <Button onClick={() => setIsAddOpen(true)} variant={"ghost"}>
          <PlusCircle size={26} />
        </Button>
      </div>
      {isLoading || isPending ? (
        <TableSkeleton columns={3} />
      ) : (
        <>{data && <DataTable columns={Columns} data={data} filter="name" />}</>
      )}
      <CustomDialog isOpen={isAddOpen} setIsOpen={setIsAddOpen} title="Add">
        <AddForm setIsOpen={setIsAddOpen} />
      </CustomDialog>
    </div>
  );
}
