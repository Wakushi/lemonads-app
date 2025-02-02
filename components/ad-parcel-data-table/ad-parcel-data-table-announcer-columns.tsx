"use client"
import { ColumnDef } from "@tanstack/react-table"
import { AdParcel } from "@/lib/types/ad-parcel.type"
import Copy from "../ui/copy"
import { createPublicClient, formatEther, http } from "viem"

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
  DialogHeader,
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
import { RiEditBoxLine } from "react-icons/ri"
import {
  getEthPrice,
  getRenterBudgetAmountByParcel,
  releaseAdParcel,
  writeAddBudget,
  writeEditAdParcelContent,
  writeWithdrawBudget,
} from "@/lib/actions/onchain/contract-actions"
import { pinAdContent } from "@/lib/actions/client/pinata-actions"
import LoaderSmall from "../ui/loader-small/loader-small"
import {
  LEMONADS_CONTRACT_ABI,
  LEMONADS_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { baseSepolia } from "viem/chains"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Label } from "recharts"
import { Input } from "../ui/input"

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
    cell: ({ row }) => {
      const { user } = useUser()
      const queryClient = useQueryClient()
      const [fundAmountUsd, setFundAmountUsd] = useState<string>("")
      const [withdrawAmountUsd, setWithdrawAmountUsd] = useState<string>("")
      const [showBudgetModal, setShowBudgetModal] = useState<boolean>(false)

      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL),
      })

      const { data: budgetAmount } = useQuery<string, Error>({
        queryKey: ["budgetAmount", row.original.id],
        queryFn: async () => {
          const ethPriceUsd = await getEthPrice()
          const budgetEth = await getRenterBudgetAmountByParcel(
            row.original.renter,
            +row.original.id
          )
          const budget = +budgetEth * +ethPriceUsd
          return budget.toFixed(2)
        },
      })

      async function fundParcel(): Promise<void> {
        if (!user?.address) return

        setShowBudgetModal(false)

        try {
          toast({
            title: "Fetching latest ETH price...",
            action: <LoaderSmall color="#000" scale={0.4} />,
          })

          const ethPriceUsd = await getEthPrice()
          const fundAmountEth = +fundAmountUsd / +ethPriceUsd

          toast({
            title: "Validating budget price...",
            action: <LoaderSmall color="#000" scale={0.4} />,
          })

          await writeAddBudget({
            account: user?.address,
            adParcelId: +row.original.id,
            amount: fundAmountEth,
          })

          toast({
            title: "Updating budget price...",
            action: <LoaderSmall color="#000" scale={0.4} />,
          })

          publicClient.watchContractEvent({
            address: LEMONADS_CONTRACT_ADDRESS,
            abi: LEMONADS_CONTRACT_ABI,
            eventName: "BudgetAdded",
            args: { renter: row.original.renter },
            onLogs: (logs: any) => {
              toast({
                title: "Success",
                description: `Successfully funded ${fundAmountUsd}$ (${fundAmountEth.toFixed(
                  4
                )} ETH) to ad parcel`,
                action: <FaCircleCheck className="text-green-600" />,
              })

              queryClient.invalidateQueries({
                queryKey: ["budgetAmount", row.original.id],
              })
            },
          })
        } catch (error) {
          console.error("Error funding ad parcel:", error)
          toast({
            title: "Error",
            description: "Failed to fund ad parcel",
            variant: "destructive",
          })
        }
      }

      async function withdrawFunds(): Promise<void> {
        if (!user?.address) return

        setShowBudgetModal(false)

        try {
          toast({
            title: "Fetching latest ETH price...",
            action: <LoaderSmall color="#000" scale={0.4} />,
          })

          const ethPriceUsd = await getEthPrice()
          const withdrawAmountEth = +withdrawAmountUsd / +ethPriceUsd

          toast({
            title: "Validating withdrawal amount...",
            action: <LoaderSmall color="#000" scale={0.4} />,
          })

          await writeWithdrawBudget({
            account: user?.address,
            adParcelId: +row.original.id,
            amount: withdrawAmountEth,
          })

          toast({
            title: "Processing withdrawal...",
            action: <LoaderSmall color="#000" scale={0.4} />,
          })

          publicClient.watchContractEvent({
            address: LEMONADS_CONTRACT_ADDRESS,
            abi: LEMONADS_CONTRACT_ABI,
            eventName: "BudgetWithdrawn",
            args: { renter: row.original.renter },
            onLogs: (logs: any) => {
              toast({
                title: "Success",
                description: `Successfully withdrew ${withdrawAmountUsd}$ (${withdrawAmountEth.toFixed(
                  4
                )} ETH) from ad parcel`,
                action: <FaCircleCheck className="text-green-600" />,
              })

              queryClient.invalidateQueries({
                queryKey: ["budgetAmount", row.original.id],
              })
            },
          })
        } catch (error) {
          console.error("Error withdrawing from ad parcel:", error)
          toast({
            title: "Error",
            description: "Failed to withdraw from ad parcel",
            variant: "destructive",
          })
        }
      }

      return (
        <div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">
              {row.original.bidUsd?.toFixed(2)}$
            </span>
            <Dialog onOpenChange={setShowBudgetModal} open={showBudgetModal}>
              <DialogTrigger onClick={() => setShowBudgetModal(true)}>
                <RiEditBoxLine />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    Ad Parcel budget (Current: {budgetAmount}$)
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500">
                    Add or withdraw budget for this ad parcel
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-right">
                      Amount to add to current budget ($)
                    </Label>
                    <Input
                      id="costPerClick"
                      placeholder="30$"
                      value={fundAmountUsd}
                      onChange={(e) => setFundAmountUsd(e.target.value)}
                    />
                    <Button onClick={fundParcel}>Fund ad parcel budget</Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-right">Withdraw budget ($)</Label>
                    <Input
                      id="amountToWithdraw"
                      placeholder="30$"
                      value={withdrawAmountUsd}
                      onChange={(e) => setWithdrawAmountUsd(e.target.value)}
                    />
                    <Button onClick={withdrawFunds}>Withdraw</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <span className="flex items-center">
            ({Number(formatEther(BigInt(row.original.bid))).toFixed(7)}{" "}
            <FaEthereum />)
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
      const { user } = useUser()
      const queryClient = useQueryClient()

      const [selectedCampaignId, setSelectedCampaignId] = useState<string>("")
      const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false)
      const [showReleaseConfirmModal, setShowReleaseConfirmModal] =
        useState<boolean>(false)

      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL),
      })

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

      async function handleReleaseParcel() {
        if (!user?.address) {
          return
        }

        toast({
          title: "Releasing parcel...",
          action: <LoaderSmall color="#000" scale={0.4} />,
        })

        try {
          await releaseAdParcel({
            account: user.address,
            adParcelId: row.original.id,
          })

          publicClient.watchContractEvent({
            address: LEMONADS_CONTRACT_ADDRESS,
            abi: LEMONADS_CONTRACT_ABI,
            eventName: "AdParcelReleased",
            args: { parcelId: BigInt(row.original.id) },
            onLogs: (logs: any) => {
              toast({
                title: "Success",
                description: "Ad parcel released !",
                action: <FaCircleCheck className="text-green-600" />,
              })

              queryClient.invalidateQueries({
                queryKey: ["rentedParcels", user?.address],
              })
            },
          })
        } catch (error: any) {
          toast({
            title: "Error",
            description: "Error releasing ad parcel. Please try again.",
            variant: "destructive",
          })
        }
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
          title: "Setting up your parcel...",
          description: "Adding new ad campaign...",
          action: <LoaderSmall color="#000" scale={0.4} />,
        })

        try {
          const contentHash = await pinAdContent(adContent, +row.original.id)

          await writeEditAdParcelContent({
            account: user.address,
            adParcelId: +row.original.id,
            contentHash: contentHash,
          })

          toast({
            title: "Update in process...",
            action: <LoaderSmall color="#000" scale={0.4} />,
          })

          publicClient.watchContractEvent({
            address: LEMONADS_CONTRACT_ADDRESS,
            abi: LEMONADS_CONTRACT_ABI,
            eventName: "AdContentUpdated",
            args: { parcelId: BigInt(row.original.id) },
            onLogs: (logs: any) => {
              toast({
                title: "Success",
                description: "Ad content updated !",
                action: <FaCircleCheck className="text-green-600" />,
              })

              queryClient.invalidateQueries({
                queryKey: ["rentedParcels", user?.address],
              })
            },
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
                onClick={() => {
                  setShowSettingsModal(false)
                  setShowReleaseConfirmModal(true)
                }}
                className="w-full"
              >
                Release Parcel
              </Button>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={showReleaseConfirmModal}
            onOpenChange={setShowReleaseConfirmModal}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will release the rent on the ad parcel ID #
                  {row.original.id}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReleaseParcel}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]
