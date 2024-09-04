"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { Website } from "@/lib/types/website.type"
import Link from "next/link"

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
    accessorKey: "trafficAverage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Traffic Average
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const trafficAverage: string = row.getValue("trafficAverage")
      return (
        <div className="pl-4 font-medium flex items-center gap-2">
          <span>{trafficAverage}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "language",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Language
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const language: string = row.getValue("language")
      return (
        <div className="pl-4 font-medium flex items-center gap-2">
          <span>{language}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "geoReach",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Geographical Reach
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const geoReach: string[] = row.getValue("geoReach")
      return (
        <div className="pl-4 font-medium flex items-center gap-2">
          <span>{geoReach}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "keywords",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Keywords
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const keywords: string[] = row.getValue("keywords")
      return (
        <div className="pl-4 font-medium flex items-center gap-2">
          <span>{keywords.join(", ")}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const websiteId = row.original.id
      return (
        <div className="flex gap-2">
          <Link href={`/website/${websiteId}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Button size="sm">Delete</Button>
        </div>
      )
    },
  },
]
