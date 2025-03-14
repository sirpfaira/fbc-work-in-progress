"use client";
import { useState, useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { PlusCircle, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ObjectId } from "mongoose";
import { TPlatform } from "@/lib/schemas/platform";
import DataTable from "@/app/components/common/DataTable";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import CustomDialog from "@/app/components/common/CustomDialog";
import PageTitle from "@/app/components/common/PageTitle";
import DeleteForm from "@/app/components/common/DeleteForm";
import AddForm from "./AddForm";
import Link from "next/link";

export default function ManagePlatforms() {
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  const columns = useMemo<ColumnDef<TPlatform>[]>(
    () => [
      {
        accessorKey: "uid",
        header: () => <div className="ml-2">Unique ID</div>,
        cell: ({ row }) => {
          return <div className="ml-2">{row.getValue("uid")}</div>;
        },
      },
      {
        header: "Markets",
        accessorFn: (row) => row.markets.length || 0,
      },
      {
        accessorKey: "url",
        header: "URL",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
      },
    ],
    []
  );

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["platforms"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/platforms`);
      return data.items as TPlatform[];
    },
  });

  if (isError) return <ErrorsTile errors={[error.message]} />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Manage platforms" link="/admin" />
        <Button onClick={() => setIsAddOpen(true)} variant={"ghost"}>
          <PlusCircle size={26} />
        </Button>
      </div>
      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : (
        <>{data && <DataTable columns={columns} data={data} filter="uid" />}</>
      )}
      <CustomDialog isOpen={isAddOpen} setIsOpen={setIsAddOpen} title="Add">
        <AddForm setIsOpen={setIsAddOpen} />
      </CustomDialog>
    </div>
  );
}

interface WithId<ObjectId> {
  _id: ObjectId;
}
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

function DataTableRowActions<TData extends WithId<ObjectId>>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const itemId = row.original._id.toString();
  return (
    <>
      <CustomDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
      >
        <DeleteForm
          itemId={itemId}
          setIsOpen={setIsDeleteOpen}
          route="platforms"
        />
      </CustomDialog>
      <div className="flex items-center">
        <Link
          href={`/admin/manage-platforms/${itemId}`}
          className="text-rating-top rounded-md p-2 transition-all duration-75 hover:bg-muted-block"
        >
          <SquarePen size={16} />
        </Link>
        <button
          onClick={() => {
            setIsDeleteOpen(true);
          }}
          className="text-destructive rounded-md p-2 transition-all duration-75 hover:bg-muted"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </>
  );
}
