"use client";
import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { SquarePen, Trash2 } from "lucide-react";
import CustomDialog from "@/app/components/common/CustomDialog";
import DeleteForm from "./DeleteForm";
import EditForm from "./EditForm";
import { ObjectId } from "mongoose";

interface WithId<T> {
  _id: ObjectId;
}
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export default function DataTableRowActions<TData extends WithId<string>>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const itemId = row.original._id.toString();
  return (
    <>
      <CustomDialog isOpen={isEditOpen} setIsOpen={setIsEditOpen} title="Edit">
        <EditForm itemId={itemId} setIsOpen={setIsEditOpen} />
      </CustomDialog>
      <CustomDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
      >
        <DeleteForm itemId={itemId} setIsOpen={setIsDeleteOpen} />
      </CustomDialog>
      <div className="flex items-center">
        <button
          onClick={() => {
            setIsEditOpen(true);
          }}
          className="text-green-600 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
        >
          <SquarePen className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            setIsDeleteOpen(true);
          }}
          className="text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
