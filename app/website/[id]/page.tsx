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
import {
  BASE_ETHERSCAN_TX_URL,
  LEMONADS_CONTRACT_ABI,
  LEMONADS_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { AdBlockCustomization } from "@/components/add-block-customization"
import { v4 as uuidv4 } from "uuid"
import { uuidToUint256 } from "@/lib/utils"
import { pinAdParcelTraits } from "@/lib/actions/client/pinata-actions"
import { ToastAction } from "@/components/ui/toast"
import { toast } from "@/components/ui/use-toast"
import { getAllPublisherAdParcels } from "@/lib/actions/onchain/contract-actions"
import Link from "next/link"
import { FaBackspace } from "react-icons/fa"
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
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { AdParcel } from "@/lib/types/ad-parcel.type"
import { createPublicClient, http } from "viem"
import { baseSepolia } from "viem/chains"

export default function WebsiteDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const { user, loading: userLoading, websites } = useUser()
  const queryClient = useQueryClient()

  const [adBlockSettings, setAdBlockSettings] = useState({})

  async function fetchWebsite(): Promise<Website | null> {
    if (!user || userLoading) return null

    const foundWebsite = websites.find((w) => w.id === id)

    if (foundWebsite) {
      return foundWebsite
    }

    try {
      const response = await fetch(
        `/api/website?id=${id}&uid=${user.firebaseId}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch website details")
      }
      const data = await response.json()
      return data
    } catch (error) {
      return null
    }
  }

  const { data: website, isLoading: loadingWebsite } = useQuery<
    Website | null,
    Error
  >({
    queryKey: ["website", user?.firebaseId],
    queryFn: () => fetchWebsite(),
    enabled: !!user?.firebaseId,
  })

  async function fetchPublisherAdParcels(): Promise<AdParcel[]> {
    if (!user?.address || !website?.url) return []
    return await getAllPublisherAdParcels(user.address, website.url)
  }

  const { data: publisherParcels, isLoading: loadingParcels } = useQuery<
    AdParcel[],
    Error
  >({
    queryKey: ["publisherParcels", website?.url],
    queryFn: () => fetchPublisherAdParcels(),
  })

  async function createAdParcel() {
    if (!user) {
      throw new Error("User not found !")
    }

    if (!website?.ipfsHash) {
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

      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL),
      })

      publicClient.watchContractEvent({
        address: LEMONADS_CONTRACT_ADDRESS,
        abi: LEMONADS_CONTRACT_ABI,
        eventName: "AdParcelCreated",
        args: { parcelId: BigInt(adParcelId) },
        onLogs: (logs: any) => {
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

          queryClient.invalidateQueries({
            queryKey: ["publisherParcels", website?.url],
          })
        },
      })
    } catch (error) {
      toast({
        title: "Error during parcel creation",
        description: `Please try again. Error: ${error}`,
      })
    }
  }

  if (loadingParcels || userLoading || loadingWebsite) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoaderSmall />
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
          <AdParcelDataTable
            columns={adParcelColumns}
            data={publisherParcels || []}
          />
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
