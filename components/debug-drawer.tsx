"use client"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import { useState } from "react"
import {
  ErrorType,
  getLastCronTimestamp,
  getPayableAdParcels,
  runAggregateClicks,
  runPayParcelOwners,
} from "@/lib/actions/onchain/contract-actions"
import { useUser } from "@/service/user.service"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { BASE_ETHERSCAN_TX_URL } from "@/lib/constants"
import { FaEthereum } from "react-icons/fa"
import { GrTest } from "react-icons/gr"

export default function DebugDrawer() {
  const { user } = useUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)

  async function onRunAggregateClicks(): Promise<void> {
    if (!user?.address) return
    setLoading(true)
    try {
      await runAggregateClicks(user?.address)

      toast({
        title: "Aggregate click ran !",
        description: "See on Chainlink Functions Manager",
        action: (
          <ToastAction
            altText="See details"
            onClick={() =>
              window.open(
                `https://functions.chain.link/base-sepolia/162`,
                "_blank"
              )
            }
          >
            See details
          </ToastAction>
        ),
      })
    } catch (error: any) {
      handleContractErrors(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function onRunPayParcelOwners(): Promise<void> {
    if (!user?.address) return

    setLoading(true)

    try {
      const transactionHash = await runPayParcelOwners(user?.address)

      toast({
        title: "Parcel owners paid !",
        description: "See on block explorer",
        action: (
          <ToastAction
            altText="See details"
            onClick={() =>
              window.open(
                `${BASE_ETHERSCAN_TX_URL}/${transactionHash}`,
                "_blank"
              )
            }
          >
            See details
          </ToastAction>
        ),
      })
    } catch (error: any) {
      handleContractErrors(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleContractErrors(error: string) {
    const errorType = error.slice(7, error.length - 2) as ErrorType

    switch (errorType) {
      case ErrorType.Lemonads__NoPayableParcel:
        toast({
          title: "Error",
          description: "No ad parcel is awaiting payment.",
          variant: "destructive",
          action: (
            <ToastAction altText="Try again" onClick={onRunPayParcelOwners}>
              Try again
            </ToastAction>
          ),
        })
        break
      case ErrorType.Lemonads__NotEnoughTimePassed:
        const lastCRONTimestamp = await getLastCronTimestamp()
        const cronDate = new Date(lastCRONTimestamp * 1000)
        const dayOfWeek = cronDate.toDateString().split(" ")[0]
        const month = cronDate.toDateString().split(" ")[1]
        const day = cronDate.toDateString().split(" ")[2]
        const year = cronDate.toDateString().split(" ")[3]
        const hours = String(cronDate.getHours()).padStart(2, "0")
        const minutes = String(cronDate.getMinutes()).padStart(2, "0")
        const formattedDate = `${dayOfWeek} ${month} ${day} ${year} ${hours}:${minutes}`

        toast({
          title: "Error",
          description: `Not enough time passed since last CRON. (Last: ${formattedDate})`,
          variant: "destructive",
          action: (
            <ToastAction altText="Try again" onClick={onRunAggregateClicks}>
              Try again
            </ToastAction>
          ),
        })
        break
      default:
        toast({
          title: "Error",
          description: "An unexpected error occured, please try again.",
          variant: "destructive",
          action: (
            <ToastAction altText="Try again" onClick={onRunPayParcelOwners}>
              Try again
            </ToastAction>
          ),
        })
        break
    }
  }

  async function checkPayableAdParcels() {
    const payableAdParcels = await getPayableAdParcels()
    console.log("payableAdParcels: ", payableAdParcels)

    toast({
      title: "Payable Ad Parcels",
      description: payableAdParcels.join(", "),
    })
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-5 right-5">
          <GrTest />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col gap-2 items-center justify-center p-8">
        <DrawerTitle className="text-3xl uppercase p-4 self-start flex items-center gap-1">
          <GrTest className="text-2xl" />
          Debug
        </DrawerTitle>
        {loading ? (
          <LoaderSmall />
        ) : (
          <div className="flex gap-4 pb-10">
            <div className="flex items-center gap-4">
              <Button onClick={() => onRunAggregateClicks()}>
                Run aggregateClicks() <FaEthereum className="ml-2" />
              </Button>
              <Button onClick={() => onRunPayParcelOwners()}>
                Run payParcelOwners() <FaEthereum className="ml-2" />
              </Button>
              <Button onClick={() => checkPayableAdParcels()}>
                Check payable parcels
              </Button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
