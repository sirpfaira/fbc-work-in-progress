"use client";
import { useState, useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Download, PlusCircle, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ObjectId } from "mongoose";
import { TFixture } from "@/lib/schemas/fixture";
import DataTable from "@/app/components/common/DataTable";
import ErrorTile from "@/app/components/common/ErrorTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import CustomDialog from "@/app/components/common/CustomDialog";
import PageTitle from "@/app/components/common/PageTitle";
import DeleteForm from "@/app/components/common/DeleteForm";
import AddForm from "./AddForm";
import Link from "next/link";
import TimeStamp from "@/app/components/common/TimeStamp";

export default function ManageFixtures() {
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  const columns = useMemo<ColumnDef<TFixture>[]>(
    () => [
      {
        accessorKey: "teams",
        header: () => <div className="ml-2">Teams</div>,
        cell: ({ row }) => {
          return <div className="ml-2">{row.getValue("teams")}</div>;
        },
      },
      {
        accessorKey: "competitionName",
        header: "Competition",
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
          return <TimeStamp date={row.getValue("date")} />;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
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
    queryKey: ["fixtures"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/fixtures`);
      return data.items as TFixture[];
    },
  });

  if (isError) return <ErrorTile error={error.message} />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Manage fixtures" link="/admin" />
        <div className="flex space-x-1 items-center">
          <Link href="/admin/manage-fixtures/fetch">
            <Download size={26} />
          </Link>
          <Button onClick={() => setIsAddOpen(true)} variant={"ghost"}>
            <PlusCircle size={26} />
          </Button>
        </div>
      </div>
      {isLoading ? (
        <TableSkeleton columns={4} />
      ) : (
        <>{data && <DataTable columns={columns} data={data} filter="name" />}</>
      )}
      <CustomDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title="Add"
        description="Add a fixture to the database"
      >
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
          route="fixtures"
        />
      </CustomDialog>
      <div className="flex items-center">
        <Link
          href={`/admin/manage-fixtures/edit/${itemId}`}
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
