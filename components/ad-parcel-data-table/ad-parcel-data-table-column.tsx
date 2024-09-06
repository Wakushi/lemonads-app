"use client"
import { ColumnDef } from "@tanstack/react-table"
import { AdParcel } from "@/lib/types/ad-parcel.type"
import Copy from "../ui/copy"
import { formatEther } from "viem"
import { shortenAddress } from "@/lib/utils"
import { PiEmpty } from "react-icons/pi"
import { FaCode, FaEthereum } from "react-icons/fa"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CodeSnippet from "../code-snippet"
import { useQuery } from "@tanstack/react-query"
import { getEthPrice } from "@/lib/actions/onchain/contract-actions"

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
    accessorKey: "earnings",
    header: "Total earnings",
    cell: ({ row }) => {
      if (!row.original.earnings) return

      const { data: ethPrice } = useQuery<string, Error>({
        queryKey: ["ethPrice"],
        queryFn: async () => {
          return await getEthPrice()
        },
      })

      const earningsUSD = ethPrice
        ? (row.original.earnings * +ethPrice).toFixed(2)
        : "NC"

      return (
        <div>
          <span className="font-semibold">{earningsUSD}$</span>{" "}
          <span className="flex items-center">
            ({row.original.earnings.toFixed(7)} <FaEthereum />)
          </span>
        </div>
      )
    },
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
  {
    id: "gear",
    header: "",
    cell: ({ row }) => <EmbedCodeDialog adParcelId={+row.original.id} />,
  },
]

const EmbedCodeDialog = ({ adParcelId }: { adParcelId: number }) => {
  const codeSnippet = `<div id="ad-parcel-container" data-ad-parcel-id="${adParcelId}">\n  <script src="https://lemonads.vercel.app/ad-parcel.js" defer></script>\n</div>`

  return (
    <Dialog>
      <DialogTrigger>
        <FaCode className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle>Embed Ad Parcel Code</DialogTitle>
        </DialogHeader>
        <div className="relative mb-6">
          <p className="mb-4 text-sm text-gray-600">
            To display this ad parcel on your website, simply copy the code
            snippet below and paste it into your website's HTML where you want
            the ad to appear. The parcel ID has already been included for you.
          </p>
          <CodeSnippet codeString={codeSnippet} language="typescript" />
          <p className="mt-4 text-sm text-gray-600">
            This script will dynamically load the ad content associated with
            this parcel ID from the Lemonads platform. If you want to make
            further adjustments, like updating the styling, make sure to wrap
            this code in your custom styles.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
