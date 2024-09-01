"use client"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import {
  getTraitsByHash,
  pinAdContent,
  pinAdParcelTraits,
  pinWebsiteMetadata,
  unpinFile,
} from "@/lib/actions/client/pinata-actions"
import { Website } from "@/lib/types/website.type"
import { useState } from "react"
import { AdParcelTraits } from "@/lib/types/ad-parcel.type"
import {
  ErrorType,
  getAdParcelById,
  getAllPublisherAdParcels,
  getLastCronTimestamp,
  getRenterFundsAmount,
  runAggregateClicks,
  runPayParcelOwners,
  writeAdParcel,
  writeEditAdParcelTraits,
  writeRentAdParcel,
} from "@/lib/actions/onchain/contract-actions"
import { mockWebsites } from "@/lib/data/website-list-mock"
import { Input } from "@/components/ui/input"
import { useUser } from "@/service/user.service"

import { uuidToUint256 } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { BASE_ETHERSCAN_TX_URL } from "@/lib/constants"
import { Label } from "@/components/ui/label"
import { FaEthereum } from "react-icons/fa"
import { GrTest } from "react-icons/gr"

export default function DebugDrawer() {
  const { user } = useUser()
  const { toast } = useToast()
  const [website, setWebsite] = useState<Website>(mockWebsites[0])
  const [searchedAdParcelId, setSearchedAdParcelId] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  async function storeWebsiteMetadata() {
    setLoading(true)
    const pinnedWebsite = await pinWebsiteMetadata(website)
    setWebsite(pinnedWebsite)
    setLoading(false)
  }

  async function createAdParcel() {
    setLoading(true)
    if (!user) {
      setLoading(false)
      throw new Error("User not found !")
    }

    if (!website.ipfsHash) {
      setLoading(false)
      throw new Error("Website hash not found !")
    }

    const traits = {
      width: "400px",
    }

    const adParcelId = uuidv4()
    const traitsHash = await pinAdParcelTraits(traits, adParcelId)

    try {
      const transactionHash = await writeAdParcel({
        account: user.address,
        id: uuidToUint256(uuidv4()),
        minBid: 1,
        traitsHash,
        websiteInfoHash: website?.ipfsHash,
      })

      toast({
        title: "Ad parcel created !",
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
    } catch (error) {
      toast({
        title: "Error during parcel creation",
        description: "Please try again. Error: " + error,
      })
    } finally {
      setLoading(false)
    }
  }

  async function getPublisherAdParcels() {
    if (!user?.address) return
    setLoading(true)
    const adParcels = await getAllPublisherAdParcels(user?.address)
    setLoading(false)
    console.log("Ad parcels: ", adParcels)
  }

  async function onRentParcel(adParcelId: number) {
    if (!user) {
      throw new Error("User not found !")
    }

    const mockAdContent = {
      description: "Come see this beautiful island",
      id: "JF1IQN7nhII4zQ6SO9wH",
      imageUrl:
        "https://peach-genuine-lamprey-766.mypinata.cloud/ipfs/QmTnWorouFdXwh31czt1EFM9UFb9HZEngXmkfZT9RxKqwm",
      linkUrl:
        "https://www.ellequebec.com/style-de-vie/voyages/martinique-les-10-meilleures-choses-a-voir-et-a-faire",
      title: "Visit Martinique !",
    }

    const contentHash = await pinAdContent(mockAdContent, adParcelId)

    writeRentAdParcel({
      account: user?.address,
      adParcelId,
      newBid: 0.0001,
      contentHash,
    })
  }

  async function onUpdateParcelTraits(
    adParcelId: number,
    newTraits: AdParcelTraits
  ) {
    if (!user) {
      throw new Error("User not found !")
    }

    if (!adParcelId) {
      throw new Error("Ad parcel id not found !")
    }

    setLoading(true)

    const adParcel = await getAdParcelById(adParcelId)

    if (!adParcel) {
      setLoading(false)
      return
    }

    let needsUpdate = false

    const traits = await getTraitsByHash(adParcel.traitsHash)

    if (traits) {
      for (let key in traits) {
        const traitKey = key as keyof AdParcelTraits

        if (traits[traitKey] !== newTraits[traitKey]) {
          needsUpdate = true
        }
      }
    }

    if (!needsUpdate) {
      setLoading(false)
      return
    }

    const traitsHash = await pinAdParcelTraits(newTraits, adParcelId.toString())

    try {
      const transactionHash = await writeEditAdParcelTraits({
        account: user?.address,
        adParcelId,
        traitsHash,
      })

      await unpinFile(adParcel.traitsHash)

      toast({
        title: "Ad parcel updated !",
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
    } catch (error) {
      toast({
        title: "Error during parcel update",
        description: "Please try again. Error: " + error,
      })
    } finally {
      setLoading(false)
    }
  }

  async function onRunAggregateClicks(): Promise<void> {
    if (!user?.address) return
    try {
      await runAggregateClicks(user?.address)
    } catch (error: any) {
      handleContractErrors(error.message)
    }
  }

  async function onRunPayParcelOwners(): Promise<void> {
    if (!user?.address) return

    try {
      await runPayParcelOwners(user?.address)
    } catch (error: any) {
      handleContractErrors(error.message)
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

  async function logRenterUserFunds() {
    if (!user?.address) return

    const funds = await getRenterFundsAmount(user?.address)
    console.log("Funds: ", funds)
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
          <div className="flex gap-4">
            <div className="flex flex-col gap-4">
              <Button onClick={() => storeWebsiteMetadata()}>
                Store website metadata
              </Button>
              <Button onClick={() => console.log(website)}>
                Check website
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              <Button onClick={() => createAdParcel()}>
                Create ad parcel <FaEthereum className="ml-2" />
              </Button>
              <Button onClick={() => getPublisherAdParcels()}>
                Get publisher parcels
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              <Button>Add funds</Button>
            </div>
            <div className="flex flex-col gap-4">
              <Button onClick={() => onRunAggregateClicks()}>
                Run aggregateClicks() <FaEthereum className="ml-2" />
              </Button>
              <Button onClick={() => onRunPayParcelOwners()}>
                Run payParcelOwners() <FaEthereum className="ml-2" />
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="adParcel">Ad parcel id</Label>
              <Input
                id="adParcel"
                value={searchedAdParcelId}
                type="text"
                onChange={(e) => setSearchedAdParcelId(e.target.value)}
              ></Input>
              <Button onClick={() => onRentParcel(+searchedAdParcelId)}>
                Rent parcel <FaEthereum className="ml-2" />
              </Button>

              <Button onClick={() => logRenterUserFunds()}>
                Log renter funds()
              </Button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
