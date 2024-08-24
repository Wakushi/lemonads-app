"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { Website } from "@/lib/types/website.type"

export const columns: ColumnDef<Website>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Website Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name: string = row.getValue("name")
      return (
        <div className="pl-4 font-medium flex items-center gap-2">
          <span>{name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "url",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          URL
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const url: string = row.getValue("url")
      return (
        <div className="pl-4 font-medium flex items-center gap-2">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const category: string = row.getValue("category")
      return (
        <div className="pl-4 font-medium flex items-center gap-2">
          <span>{category}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "trafficVolume",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Traffic Volume
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const trafficVolume: string = row.getValue("trafficVolume")
      return (
        <div className="pl-4 font-medium flex items-center gap-2">
          <span>{trafficVolume}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "contactEmail",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const contactEmail: string = row.getValue("contactEmail")
      return (
        <div className="pl-4 font-medium flex items-center gap-2">
          <span>{contactEmail}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button size="sm">Delete</Button>
        </div>
      )
    },
  },
]
