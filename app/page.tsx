"use client"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import {
  getTraitsByHash,
  getWebsiteByHash,
  pinAdContent,
  pinAdParcelTraits,
  pinWebsiteMetadata,
  unpinFile,
} from "@/lib/actions/client/pinata-actions"
import { Website } from "@/lib/types/website.type"
import { useEffect, useState } from "react"
import { AdParcelTraits } from "@/lib/types/ad-parcel.type"
import {
  getAdParcelById,
  getAllPublisherAdParcels,
  writeAdParcel,
  writeEditAdParcelTraits,
  writeRentAdParcel,
} from "@/lib/actions/onchain/contract-actions"
import { mockWebsites } from "@/lib/data/website-list-mock"
import { Input } from "@/components/ui/input"
import { useUser } from "@/service/user.service"
import {
  createAdContent,
  getAllClicks,
  getAllImpressions,
} from "@/lib/actions/client/firebase-actions"
import { generateRandomAdEvents, uuidToUint256 } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { AMOY_ETHERSCAN_TX_URL } from "@/lib/constants"
import { AdContent } from "@/lib/types/ad-content.type"
import { adContentMock } from "@/lib/data/ad-content-mock"
import { Label } from "@/components/ui/label"
import { ImpressionChart } from "@/components/impressions-chart"
import { AdEvent } from "@/lib/types/interaction.type"
import { AdEventsBarChart } from "@/components/ad-events-bar-chart"

export default function Home() {
  const { user } = useUser()
  const { toast } = useToast()
  const [website, setWebsite] = useState<Website>(mockWebsites[0])
  const [adContent, setAdContent] = useState<AdContent>(adContentMock)
  const [searchedAdParcelId, setSearchedAdParcelId] = useState<string>("")
  const [impressions, setImpressions] = useState<AdEvent[]>([])
  const [clicks, setClicks] = useState<AdEvent[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false)
  const [file, setFile] = useState<File>()

  useEffect(() => {
    async function fetchEvents() {
      setLoadingEvents(true)
      const allClicks = await getAllClicks()
      const allImpressions = await getAllImpressions()
      // const data = generateRandomAdEvents(140)
      setImpressions(allImpressions)
      setClicks(allClicks)
      setLoadingEvents(false)
    }

    fetchEvents()
  }, [])

  function onSelectMedia(event: any) {
    const file = event.target.files[0]
    if (file) {
      setFile(file)
    }
  }

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

  async function submitAdContent() {
    if (!user) return

    const title = "Chainlink"
    const description =
      "Chainlink connects existing systems to any public or private blockchain and enables secure cross-chain communication. World-class developer experience."
    const linkUrl = "https://chain.link/"

    if (!file) {
      console.error("No file selected")
      return
    }

    setLoading(true)

    const createdAdContent = await createAdContent({
      user,
      file,
      title,
      description,
      linkUrl,
    })

    if (!createdAdContent) return
    setAdContent(createdAdContent)
    setLoading(false)
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
        title: "Error during parcel update",
        description: "Please try again. Error: " + error,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-[100vh] flex items-center justify-center">
        <LoaderSmall />
      </main>
    )
  }

  return (
    <main className="min-h-[100vh] flex flex-col items-center justify-center gap-8">
      {loadingEvents ? (
        <LoaderSmall />
      ) : (
        <div className="flex gap-8">
          <ImpressionChart clicks={clicks} impressions={impressions} />
          <AdEventsBarChart clicks={clicks} impressions={impressions} />
        </div>
      )}
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <Button onClick={() => storeWebsiteMetadata()}>
            Store website metadata
          </Button>
          <Button onClick={() => console.log(website)}>Check website</Button>
        </div>
        <div className="flex flex-col gap-4">
          <Button onClick={() => createAdParcel()}>Create ad parcel</Button>
          <Button
            onClick={() =>
              onUpdateParcelTraits(+searchedAdParcelId, {
                width: "500px",
              })
            }
          >
            Update ad parcel traits
          </Button>
          <Button onClick={() => getPublisherAdParcels()}>
            Get publisher parcels
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <Button onClick={() => submitAdContent()}>Create ad content</Button>
          <Input type="file" onChange={(e) => onSelectMedia(e)}></Input>
          <Button onClick={() => console.log(adContent)}>
            Check ad content
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
            Rent parcel
          </Button>
        </div>
      </div>
    </main>
  )
}
