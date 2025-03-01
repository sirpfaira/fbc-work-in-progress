"use client";
import { useState, useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { PlusCircle, ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ObjectId } from "mongoose";
import { TOddSelector } from "@/lib/schemas/oddselector";
import DataTable from "@/app/components/common/DataTable";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import CustomDialog from "@/app/components/common/CustomDialog";
import PageTitle from "@/app/components/common/PageTitle";
import DeleteForm from "@/app/components/common/DeleteForm";
import AddForm from "./AddForm";
import EditForm from "./EditForm";

export default function ManageOddSelectors() {
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  const columns = useMemo<ColumnDef<TOddSelector>[]>(
    () => [
      {
        accessorKey: "uid",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="table"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <div className="ml-2">Unique ID</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          return <div className="ml-2">{row.getValue("uid")}</div>;
        },
      },
      { accessorKey: "apiId", header: "API ID" },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              size="table"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Odd Selector Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      { accessorKey: "alias", header: "Alias(es)" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
      },
    ],
    []
  );

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["oddselectors"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/oddselectors`);
      return data.items as TOddSelector[];
    },
  });

  if (isError) return <ErrorsTile errors={[error.message]} />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Manage Odd Selectors" link="/admin" />
        <div className="flex">
          <Button
            onClick={() => setIsAddOpen(true)}
            size={"icon"}
            variant={"ghost"}
          >
            <PlusCircle size={24} />
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
        description="Please provide the information required."
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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const itemId = row.original._id.toString();
  return (
    <>
      <CustomDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Item"
        description="Please provide the information required"
      >
        <EditForm itemId={itemId} setIsOpen={setIsEditOpen} />
      </CustomDialog>
      <CustomDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
      >
        <DeleteForm
          itemId={itemId}
          setIsOpen={setIsDeleteOpen}
          route="oddselectors"
        />
      </CustomDialog>
      <div className="flex items-center">
        <button
          onClick={() => {
            setIsEditOpen(true);
          }}
          className="text-rating-top rounded-md p-2 transition-all duration-75 hover:bg-muted-block"
        >
          <SquarePen size={16} />
        </button>
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
