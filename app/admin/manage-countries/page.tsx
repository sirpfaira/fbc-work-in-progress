"use client";
import { Dispatch, SetStateAction, useState, useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  PlusCircle,
  ArrowUpDown,
  SquarePen,
  Trash2,
  ScanEye,
  CircleCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ObjectId } from "mongoose";
import { TCountry } from "@/lib/schemas/country";
import DataTable from "@/app/components/common/DataTable";
import ErrorTile from "@/app/components/common/ErrorTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import CustomDialog from "@/app/components/common/CustomDialog";
import PageTitle from "@/app/components/common/PageTitle";
import DeleteForm from "@/app/components/common/DeleteForm";
import AddForm from "./AddForm";
import EditForm from "./EditForm";

export default function ManageCountries() {
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isValidateOpen, setIsValidateOpen] = useState<boolean>(false);

  const columns = useMemo<ColumnDef<TCountry>[]>(
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
              Country Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
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
    queryKey: ["countries"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/countries`);
      return data.items as TCountry[];
    },
  });

  if (isError) return <ErrorTile error={error.message} />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Manage countries" link="/admin" />
        <div className="flex">
          {data && (
            <Button
              onClick={() => setIsValidateOpen(true)}
              size={"icon"}
              variant={"ghost"}
            >
              <ScanEye size={24} />
            </Button>
          )}
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
        <TableSkeleton columns={3} />
      ) : (
        <>{data && <DataTable columns={columns} data={data} filter="name" />}</>
      )}
      <CustomDialog isOpen={isAddOpen} setIsOpen={setIsAddOpen} title="Add">
        <AddForm setIsOpen={setIsAddOpen} />
      </CustomDialog>
      {isValidateOpen && data && (
        <ValidateData array={data} setIsValidateOpen={setIsValidateOpen} />
      )}
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
          route="countries"
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

interface ValidateDataProps {
  array: TCountry[];
  setIsValidateOpen: Dispatch<SetStateAction<boolean>>;
}

function ValidateData({ array, setIsValidateOpen }: ValidateDataProps) {
  const ids = new Set();
  const duplicates = [];

  for (const item of array) {
    if (ids.has(item.uid)) {
      duplicates.push(item.uid);
    }
    ids.add(item.uid);

    // if (nested) {
    //   if (item[nested]) {
    //     const subIds = new Set();
    //     for (const subItem of item[nested]) {
    //       if (subIds.has(subItem._id)) {
    //         subs.push(`${item.uid}:${subItem._id}`);
    //       }
    //       subIds.add(subItem._id);
    //     }
    //   }
    // }
  }

  return (
    <div className="card relative p-3 w-full">
      <Button
        className="absolute right-0 top-0"
        onClick={() => setIsValidateOpen(false)}
        variant={"ghost"}
      >
        <X />
      </Button>
      {duplicates.length > 0 ? (
        <div className="flex flex-col">
          <span className="flex font-medium text-big border-b border-border w-full">
            Results
          </span>
          <div className="flex flex-col space-y-2 w-full">
            {duplicates.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex space-x-3">
          <CircleCheck className="text-rating-top" />
          <span className="font-medium">No issues found</span>
        </div>
      )}
    </div>
  );
}
