"use client"
import { ColumnDef } from "@tanstack/react-table"
import { AdParcel } from "@/lib/types/ad-parcel.type"
import Copy from "../ui/copy"
import { formatEther } from "viem"

import { PiEmpty } from "react-icons/pi"
import { FaEthereum } from "react-icons/fa"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useUser } from "@/service/user.service"
import { getAdContents } from "@/lib/actions/client/firebase-actions"
import { AdContent } from "@/lib/types/ad-content.type"
import { toast } from "@/components/ui/use-toast"
import { FaCircleCheck, FaGear } from "react-icons/fa6"
import { writeEditAdParcelContent } from "@/lib/actions/onchain/contract-actions"
import { pinAdContent } from "@/lib/actions/client/pinata-actions"
import LoaderSmall from "../ui/loader-small/loader-small"

export const adParcelAnnouncerColumns: ColumnDef<AdParcel>[] = [
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
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (
      <div className={row.original.active ? "text-green-500" : "text-red-500"}>
        {row.original.active ? "Active" : "Inactive"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [selectedCampaignId, setSelectedCampaignId] = useState<string>("")
      const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false)
      const { user } = useUser()
      const queryClient = useQueryClient()

      const { data: adContents } = useQuery<AdContent[], Error>({
        queryKey: ["adContents", user?.firebaseId],
        queryFn: async () => {
          if (!user?.firebaseId) return []
          const adContents = await getAdContents(user.firebaseId)
          return adContents.filter(
            (adContent) =>
              adContent.firebaseId !== row.original.content?.firebaseId
          )
        },
      })

      const handleReleaseParcel = () => {
        console.log("Release ad parcel with ID:", row.original.id)
        // Implement release logic
      }

      async function handleUpdateCampaign() {
        if (!user?.address) {
          return
        }

        const adContent = adContents?.find(
          (a) => a.firebaseId === selectedCampaignId
        )

        if (!adContent) return

        setShowSettingsModal(false)

        toast({
          title: "Updating parcel...",
          description: "Adding new ad campaign...",
          action: <LoaderSmall color="#000" scale={0.4} />,
        })

        try {
          const contentHash = await pinAdContent(adContent, +row.original.id)

          await writeEditAdParcelContent({
            account: user?.address,
            adParcelId: +row.original.id,
            contentHash: contentHash,
          })

          toast({
            title: "Success",
            description: "Ad content updated !",
            action: <FaCircleCheck className="text-green-600" />,
          })

          queryClient.invalidateQueries({
            queryKey: ["rentedParcels", user?.address],
          })
        } catch (error: any) {
          toast({
            title: "Error",
            description: "Error updating ad parcel campaing. Please try again.",
            variant: "destructive",
          })
        }
      }

      return (
        <div className="space-y-2">
          <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
            <DialogTrigger onClick={() => setShowSettingsModal(true)}>
              <FaGear />
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Ad parcel settings</DialogTitle>
              {!!adContents && !!adContents.length ? (
                <>
                  <Select onValueChange={setSelectedCampaignId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {adContents.map((campaign) => (
                        <SelectItem
                          key={campaign.firebaseId}
                          value={campaign.firebaseId!}
                        >
                          {campaign.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleUpdateCampaign}
                    className="w-full mt-2"
                    disabled={!selectedCampaignId}
                  >
                    Update Campaign
                  </Button>
                </>
              ) : (
                <Link
                  href="/announcer?view=adContent"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                >
                  Create Campaign
                </Link>
              )}
              <Button
                variant="destructive"
                onClick={handleReleaseParcel}
                className="w-full"
              >
                Release Parcel
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
  },
]
