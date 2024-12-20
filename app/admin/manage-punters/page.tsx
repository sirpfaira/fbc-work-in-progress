"use client";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ObjectId } from "mongoose";
import { TPunter } from "@/lib/schemas/punter";
import DataTable from "@/app/components/common/DataTable";
import ErrorTile from "@/app/components/common/ErrorTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import CustomDialog from "@/app/components/common/CustomDialog";
import PageTitle from "@/app/components/common/PageTitle";
import DeleteForm from "@/app/components/common/DeleteForm";
import AddForm from "./AddPunterForm";
import EditForm from "./EditForm";
import { TDummy } from "@/lib/schemas/dummy";

export default function ManagePunters() {
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  const columns = useMemo<ColumnDef<TPunter>[]>(
    () => [
      {
        accessorKey: "username",
        header: () => <div className="ml-2">User name</div>,
        cell: ({ row }) => {
          return <div className="ml-2">@{row.getValue("username")}</div>;
        },
      },
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
              Punter Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "country",
        header: "Country",
      },
      {
        header: "Followers",
        accessorFn: (row) => row.followers.length || 0,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
      },
    ],
    []
  );

  const {
    data: dummies,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["dummies"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/dummies`);
      return data.items as TDummy[];
    },
  });

  const { data: punters } = useQuery({
    queryKey: ["punters"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/punters`);
      return data.items as TPunter[];
    },
  });

  if (isError) return <ErrorTile error={error.message} />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Manage punters" link="/admin" />
        <Button onClick={() => setIsAddOpen(true)} variant={"ghost"}>
          <PlusCircle size={26} />
        </Button>
      </div>
      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : (
        <>
          {dummies && punters && (
            <DataTableFilter
              columns={columns}
              dummies={dummies}
              punters={punters}
              filter="name"
            />
          )}
        </>
      )}
      <CustomDialog isOpen={isAddOpen} setIsOpen={setIsAddOpen} title="Add">
        <AddForm setIsOpen={setIsAddOpen} />
      </CustomDialog>
    </div>
  );
}

interface DataTableFilterProps {
  columns: ColumnDef<TPunter>[];
  dummies: TDummy[];
  punters: TPunter[];
  filter: string;
}

function DataTableFilter({
  columns,
  dummies,
  punters,
  filter,
}: DataTableFilterProps) {
  const [showDummiesOnly, setShowDummiesOnly] = useState<boolean>(false);
  const [currentItems, setCurrentItems] = useState<TPunter[]>(punters);

  useEffect(() => {
    if (showDummiesOnly) {
      const dummyPunters = punters?.filter((item1) =>
        dummies?.some((item2) => item2.username === item1.username)
      );
      setCurrentItems(dummyPunters);
    } else {
      setCurrentItems(punters);
    }
  }, [showDummiesOnly, dummies, punters]);

  return (
    <>
      <div className="flex space-x-2 card p-3">
        <Switch
          checked={showDummiesOnly}
          onCheckedChange={setShowDummiesOnly}
        />
        <span>Show Dummy Punters Only</span>
      </div>
      {currentItems && (
        <DataTable columns={columns} data={currentItems} filter={filter} />
      )}
    </>
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
          route="punters"
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
