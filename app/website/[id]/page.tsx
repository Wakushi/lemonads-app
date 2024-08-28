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
} from "@/components/ui/alert-dialog";
import { AMOY_ETHERSCAN_TX_URL } from "@/lib/constants";
import { AdBlockCustomization } from "@/components/add-block-customization";
import { v4 as uuidv4 } from "uuid";
import { uuidToUint256 } from "@/lib/utils";
import { pinAdParcelTraits } from "@/lib/actions/client/pinata-actions";
import { writeAdParcel } from "@/lib/actions/onchain/contract-actions";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { getAllPublisherAdParcels } from "@/lib/actions/onchain/contract-actions"
import Link from "next/link"
import { FaBackspace } from "react-icons/fa"

const WebsiteDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params
  const { user, loading: userLoading, websites } = useUser()

  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);
  const [adBlockSettings, setAdBlockSettings] = useState({});
  const [adParcels, setAdParcels] = useState<any[]>([]); 

  useEffect(() => {
    const fetchWebsite = async () => {
      const foundWebsite = websites.find((w) => w.id === id)
      
      if (foundWebsite) {
        setWebsite(foundWebsite)
      }

      if (!user || userLoading) return

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
      if (!user?.address) return;
      setLoading(true);
      try {
        const adParcels = await getAllPublisherAdParcels(user.address);
        setAdParcels(adParcels);
        console.log(adParcels);
      } catch (error) {
        console.error("Failed to fetch ad parcels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdParcels();
  }, [user]);

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

    const adParcelId = uuidv4()
    const traitsHash = await pinAdParcelTraits(traits, adParcelId)

    try {
      const transactionHash = await writeAdParcel({
        account: user.address,
        id: uuidToUint256(adParcelId),
        minBid: 1,
        traitsHash,
        websiteInfoHash: website.ipfsHash,
      })

      toast({
        title: "Ad parcel created !",
        description: "See on block explorer",
        action: (
          <ToastAction
            altText="See details"
            onClick={() =>
              window.open(
                `${AMOY_ETHERSCAN_TX_URL}/${transactionHash}`,
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
    <div className="px-10 flex justify-around w-full h-[90vh] pt-[10rem]">
      <Link
        className="text-brand text-xl absolute top-[6rem] left-10 flex items-center gap-2 opacity-80 hover:opacity-100 hover:gap-1 hover:translate-x-[-2px] transition-all duration-500"
        href="/publisher"
      >
        <FaBackspace className="text-2xl" />
        <span>Back</span>
      </Link>
      <div className="w-1/2">
        <h1 className="text-3xl font-bold mb-4">{website.name}</h1>
        <p className="mb-2">
          <strong>URL:</strong>{" "}
          <a href={website.url} target="_blank" rel="noopener noreferrer">
            {website.url}
          </a>
        </p>
        <p className="mb-2">
          <strong>Category:</strong> {website.category}
        </p>
        <p className="mb-2">
          <strong>Traffic Average:</strong> {website.trafficAverage}
        </p>
        <p className="mb-2">
          <strong>Language:</strong> {website.language}
        </p>
        <p className="mb-2">
          <strong>Geographical Reach:</strong> {website.geoReach.join(", ")}
        </p>
        <p className="mb-2">
          <strong>Keywords:</strong> {website.keywords.join(", ")}
        </p>
      </div>

      <div className="w-1/2 h-full py-10">
        <div className="grid grid-cols-3 gap-4 p-4 border border-gray-300 rounded-lg h-full">
          {adParcels.map((parcel, index) => (
            <div key={index} className="h-1/3 border border-gray-300 bg-gray-100 bg-opacity-40 shadow-inner flex items-center justify-center">
              Bloc {index + 1}
            </div>
          ))}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="h-1/3 border border-gray-300 bg-gray-100 bg-opacity-40 shadow-inner flex items-center justify-center cursor-pointer">
                <span className="text-3xl text-gray-500">+</span>
              </div>
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
                <AlertDialogAction onClick={createAdParcel}>
                  Create
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}

export default WebsiteDetailPage
