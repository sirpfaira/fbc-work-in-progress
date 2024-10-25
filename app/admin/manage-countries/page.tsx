"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

export default function ManageCountries() {
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/countries`);
      return data.items as TCountry[];
    },
  });

  if (isError) return <ErrorTile error={error.message} />;

  return (
    <div className="flex flex-col space-y-5 p-5">
      <div className="flex justify-between card p-4">
        <span>Manage countries</span>
        <Button onClick={() => setIsAddOpen(true)} variant={"ghost"}>
          <PlusCircle />
        </Button>
      </div>
      {isLoading ? (
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
