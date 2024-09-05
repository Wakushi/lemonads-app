"use client"
import { useEffect, useState } from "react"
import { Website } from "@/lib/types/website.type"
import { useUser } from "@/service/user.service"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
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
import { BASE_ETHERSCAN_TX_URL } from "@/lib/constants"
import { AdBlockCustomization } from "@/components/add-block-customization"
import { v4 as uuidv4 } from "uuid"
import { uuidToUint256 } from "@/lib/utils"
import { pinAdParcelTraits } from "@/lib/actions/client/pinata-actions"
import { ToastAction } from "@/components/ui/toast"
import { toast } from "@/components/ui/use-toast"
import { getAllPublisherAdParcels } from "@/lib/actions/onchain/contract-actions"
import Link from "next/link"
import { FaBackspace } from "react-icons/fa"
import { zeroAddress } from "viem"
import { MdOutlineScreenshotMonitor } from "react-icons/md"
import Copy from "@/components/ui/copy"
import { AdParcelDataTable } from "@/components/ad-parcel-data-table/ad-parcel-data-table"
import { adParcelColumns } from "@/components/ad-parcel-data-table/ad-parcel-data-table-column"
import {
  FaExternalLinkAlt,
  FaGlobeAmericas,
  FaLanguage,
  FaTags,
} from "react-icons/fa"
import { BiCategory } from "react-icons/bi"
import { AiOutlineLineChart } from "react-icons/ai"
import { Button } from "@/components/ui/button"

export default function WebsiteDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const { user, loading: userLoading, websites } = useUser()

  const [website, setWebsite] = useState<Website | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [adBlockSettings, setAdBlockSettings] = useState({})
  const [adParcels, setAdParcels] = useState<any[]>([])

  const [loading, setLoading] = useState<boolean>(true)
  const [loadingParcels, setLoadingParcels] = useState<boolean>(true)

  useEffect(() => {
    const fetchWebsite = async () => {
      if (!user || userLoading) return
      const foundWebsite = websites.find((w) => w.id === id)

      if (foundWebsite) {
        setWebsite(foundWebsite)
      }

      try {
        const response = await fetch(
          `/api/website?id=${id}&uid=${user.firebaseId}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch website details")
        }
        const data = await response.json()
        setWebsite(data)
      } catch (error) {
        setError("An error occurred while fetching the website details.")
      } finally {
        setLoading(false)
      }
    }

    fetchWebsite()
  }, [id, user, userLoading])

  useEffect(() => {
    const fetchAdParcels = async () => {
      if (!user?.address || !website?.url) return

      try {
        const adParcels = await getAllPublisherAdParcels(
          user.address,
          website.url
        )

        setAdParcels(adParcels)
      } catch (error) {
        console.error("Failed to fetch ad parcels:", error)
      } finally {
        setLoadingParcels(false)
      }
    }

    fetchAdParcels()
  }, [user, website?.url])

  async function createAdParcel() {
    setLoading(true)

    if (!user) {
      setLoading(false)
      throw new Error("User not found !")
    }

    if (!website?.ipfsHash) {
      setLoading(false)
      throw new Error("Website hash not found !")
    }

    const traits = {
      ...adBlockSettings,
    }

    const adParcelId = uuidToUint256(uuidv4())

    toast({
      title: "Verifying and uploading ad parcel settings...",
      action: <LoaderSmall color="#000" scale={0.4} />,
    })

    const traitsHash = await pinAdParcelTraits(traits, adParcelId.toString())
    const minBid = 0.0001

    toast({
      title: "Uploading ad parcel...",
      action: <LoaderSmall color="#000" scale={0.4} />,
    })

    try {
      const response = await fetch("/api/ad/parcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: adParcelId,
          minBid: minBid * 10e18,
          owner: user.address,
          traitsHash,
          websiteInfoHash: website.ipfsHash,
        }),
      })

      const transactionHash = await response.json()

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

      setAdParcels((prevAdParcels) => [
        ...prevAdParcels,
        {
          id: adParcelId.toString(),
          bid: 0,
          minBid: 1,
          owner: user.address,
          renter: zeroAddress,
          traitsHash,
          websiteInfoHash: website.ipfsHash,
          active: true,
        },
      ])
    } catch (error) {
      toast({
        title: "Error during parcel creation",
        description: `Please try again. Error: ${error}`,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoaderSmall />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl pt-20">
        {error}
      </div>
    )
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl pt-20">
        Website not found
      </div>
    )
  }

  return (
    <div className="px-10 flex flex-col gap-4 w-full h-[90vh] pt-[10rem]">
      <Link
        className="text-brand text-xl absolute top-[6rem] left-10 flex items-center gap-2 opacity-80 hover:opacity-100 hover:gap-1 hover:translate-x-[-2px] transition-all duration-500"
        href="/publisher?view=adContent"
      >
        <FaBackspace className="text-2xl" />
        <span>Back</span>
      </Link>
      <WebsiteDetails
        website={website}
        createAdParcel={createAdParcel}
        setAdBlockSettings={setAdBlockSettings}
      />
      <div className="pt-8">
        {loadingParcels ? (
          <LoaderSmall />
        ) : (
          <AdParcelDataTable columns={adParcelColumns} data={adParcels} />
        )}
      </div>
    </div>
  )
}

function WebsiteDetails({
  website,
  createAdParcel,
  setAdBlockSettings,
}: {
  website: Website
  createAdParcel: () => void
  setAdBlockSettings: (state: any) => void
}) {
  return (
    <div className="w-full flex bg-brand text-white shadow-md p-6 rounded-lg">
      <div className="flex items-center gap-2 mr-8">
        <h1 className="text-3xl font-bold">{website.name}</h1>

        <div className="flex text-xl items-center">
          <a href={website.url} target="_blank" rel="noopener noreferrer">
            <FaExternalLinkAlt className="text-white" />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center">
          <BiCategory className="text-xl" />
          <span className="font-semibold ml-1">{website.category}</span>
        </div>

        <div className="flex items-center">
          <AiOutlineLineChart className=" text-xl" />{" "}
          <span className="font-semibold ml-1 ">{website.trafficAverage}</span>
        </div>

        <div className="flex items-center">
          <FaLanguage className=" text-xl" />
          <span className="font-semibold ml-1 ">{website.language}</span>
        </div>

        <div className="flex items-center">
          <FaGlobeAmericas className=" text-xl" />
          <span className="font-semibold ml-1 ">{website.geoReach}</span>
        </div>

        <div className="flex items-center">
          <FaTags className=" text-xl" />
          <span className="font-semibold ml-1 ">
            {website.keywords.join(", ")}
          </span>
        </div>
      </div>

      <CreateAdParcelDialog
        createAdParcel={createAdParcel}
        setAdBlockSettings={setAdBlockSettings}
      />
    </div>
  )
}

function CreateAdParcelDialog({
  createAdParcel,
  setAdBlockSettings,
}: {
  createAdParcel: () => void
  setAdBlockSettings: (settings: any) => void
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="ml-auto bg-white text-brand hover:bg-slate-50 hover:shadow-lg transition-all duration-200 ease-in-out">
          Add parcel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-7xl w-full h-[90vh] mx-auto overflow-y-auto p-10">
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Ad Block</AlertDialogTitle>
          <AlertDialogDescription>
            Customize and create your new ad block here.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AdBlockCustomization setAdBlockSettings={setAdBlockSettings} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={createAdParcel}>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
