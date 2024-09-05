import { ColumnDef } from "@tanstack/react-table"
import { AdParcel } from "@/lib/types/ad-parcel.type"
import Copy from "../ui/copy"

export const adParcelColumns: ColumnDef<AdParcel>[] = [
  {
    accessorKey: "id",
    header: "Parcel ID",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        #{row.original.id}
        <Copy contentToCopy={row.original.id} />
      </div>
    ),
  },
  {
    accessorKey: "bid",
    header: "Current Bid",
    cell: ({ row }) => `${row.original.bid} ETH`,
  },
  {
    accessorKey: "minBid",
    header: "Min Bid",
    cell: ({ row }) => `${row.original.minBid} ETH`,
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => (
      <div className="text-gray-600">{row.original.owner}</div>
    ),
  },
  {
    accessorKey: "renter",
    header: "Renter",
    cell: ({ row }) => (
      <div className={row.original.renter ? "text-green-500" : "text-red-500"}>
        {row.original.renter || "Not Rented"}
      </div>
    ),
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => (
      <div className={row.original.active ? "text-green-500" : "text-red-500"}>
        {row.original.active ? "Active" : "Inactive"}
      </div>
    ),
  },
]
