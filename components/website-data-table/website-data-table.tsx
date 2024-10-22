"use client"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Website } from "@/lib/types/website.type"
import { Input } from "../ui/input"
import LoaderSmall from "../ui/loader-small/loader-small"
import { DataTablePagination } from "../data-table-pagination"
import AddWebsiteDialog from "../add-website-modal"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function WebsiteDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [loading, setLoading] = useState<boolean>(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="bg-white shadow-lg flex-1">
      <div className="p-4 ">
        <div className="flex items-center justify-between gap-2">
          <TableFilters table={table} />
          <div className="flex items-center gap-2">
            <DeleteSelectedWebsiteAlertDialog table={table} loading={loading} />
            <AddWebsiteDialog />
            <ColumnSelection table={table} />
          </div>
        </div>
      </div>
      <div className="rounded-md ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="justify-center max-w-[200px]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="border-t border-slate-800 flex items-center justify-end space-x-2 p-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}

const columnsLabels = {
  name: "Website Name",
  url: "URL",
  category: "Category",
  trafficAverage: "Traffic Average",
  language: "Language",
  geoReach: "Geographical Reach",
  keywords: "Keywords",
}

function TableFilters({ table }: any) {
  return (
    <div className="flex flex-wrap items-center w-full gap-2 mb-2">
      <Input
        placeholder="Website Name"
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-[200px]"
      />
      <Input
        placeholder="Category"
        value={(table.getColumn("category")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("category")?.setFilterValue(event.target.value)
        }
        className="max-w-[200px]"
      />
    </div>
  )
}

function ColumnSelection({ table }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex-1 w-full">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column: any) => column.getCanHide())
          .map((column: any) => {
            if (column.id === "actions") return null
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {columnsLabels[column.id as keyof typeof columnsLabels]}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DeleteSelectedWebsiteAlertDialog({ table, loading }: any) {
  const router = useRouter()

  async function deleteSelected(): Promise<void> {
    const selectedWebsites = table
      .getFilteredSelectedRowModel()
      .rows.map((r: any) => r.original as Website)

    selectedWebsites.forEach(async (website: Website) => {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/website?id=${website.id}`, // TO IMPLEMENT
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        router.refresh()
      } catch (error) {
        console.error(error)
      }
    })
  }

  function getSelecteRowsAmount(): number {
    return table.getFilteredSelectedRowModel().rows.length
  }

  if (!getSelecteRowsAmount()) return null

  if (loading) return <LoaderSmall />

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex-1 w-full">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible and will delete the website.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteSelected}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
