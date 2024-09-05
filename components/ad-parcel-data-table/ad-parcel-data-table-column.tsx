import { ColumnDef } from "@tanstack/react-table"
import { AdParcel } from "@/lib/types/ad-parcel.type"
import Copy from "../ui/copy"
import { formatEther } from "viem"
import { shortenAddress } from "@/lib/utils"
import { PiEmpty } from "react-icons/pi"
import { FaEthereum } from "react-icons/fa"
import Link from "next/link"

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
    accessorKey: "content.title",
    header: "Title",
    cell: ({ row }) => row.original.content?.title || <PiEmpty />,
  },
  {
    accessorKey: "content.description",
    header: "Description",
    cell: ({ row }) => row.original.content?.description || <PiEmpty />,
  },
  {
    accessorKey: "content.linkUrl",
    header: "Link",
    cell: ({ row }) =>
      row.original.content?.linkUrl ? (
        <a
          href={row.original.content?.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {row.original.content.linkUrl}
        </a>
      ) : (
        <PiEmpty />
      ),
  },
  {
    accessorKey: "content.imageUrl",
    header: "Image",
    cell: ({ row }) =>
      row.original.content?.imageUrl ? (
        <Link href={row.original.content.imageUrl} target="_blank">
          <img
            src={row.original.content.imageUrl}
            alt={row.original.content?.title || "Ad Image"}
            className="w-16 h-16 object-cover rounded"
          />
        </Link>
      ) : (
        <PiEmpty />
      ),
  },
  {
    accessorKey: "bid",
    header: "Current Bid",
    cell: ({ row }) => (
      <div>
        <span className="font-semibold">
          {row.original.bidUsd?.toFixed(2)}$
        </span>{" "}
        <span className="flex items-center">
          ({Number(formatEther(BigInt(row.original.bid))).toFixed(7)}{" "}
          <FaEthereum />)
        </span>
      </div>
    ),
  },
  {
    accessorKey: "minBid",
    header: "Min Bid",
    cell: ({ row }) => (
      <div>
        <span className="font-semibold">
          {row.original.minBidUsd?.toFixed(2)}$
        </span>{" "}
        <span className="flex items-center">
          ({Number(formatEther(BigInt(row.original.minBid))).toFixed(7)}{" "}
          <FaEthereum />)
        </span>
      </div>
    ),
  },
  {
    accessorKey: "renter",
    header: "Renter",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {row.original.renter &&
        row.original.renter !== "0x0000000000000000000000000000000000000000" ? (
          <>
            {shortenAddress(row.original.renter)}
            <Copy contentToCopy={row.original.renter} />
          </>
        ) : (
          <span className="text-red-500">Not Rented</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (
      <div className={row.original.active ? "text-green-500" : "text-red-500"}>
        {row.original.active ? "Active" : "Inactive"}
      </div>
    ),
  },
]
