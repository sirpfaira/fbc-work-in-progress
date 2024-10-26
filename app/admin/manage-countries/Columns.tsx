"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTableRowActions from "./DataTableRowActions";
import { TCountry } from "@/lib/schemas/country";

const Columns: ColumnDef<TCountry>[] = [
  {
    accessorKey: "uid",
    header: "UID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="table"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
];

export default Columns;
