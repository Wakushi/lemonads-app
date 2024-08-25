"use client"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import {
  getTraitsByHash,
  getWebsiteByHash,
  pinAdParcelTraits,
  pinFile,
  pinWebsiteMetadata,
} from "@/lib/actions/client/pinata-actions"
import { Website } from "@/lib/types/website.type"
import { useState } from "react"
import { AdParcel, AdParcelTraits } from "@/lib/types/ad-parcel.type"
import {
  getAdParcelById,
  writeAdParcel,
} from "@/lib/actions/onchain/contrat-actions"
import { mockWebsites } from "@/lib/data/website-list-mock"
import { Input } from "@/components/ui/input"
import { fileToBuffer } from "@/lib/utils"

export default function Home() {
  const [website, setWebsite] = useState<Website>(mockWebsites[0])
  const [loading, setLoading] = useState<boolean>(false)
  const [file, setFile] = useState<File>()

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
    if (!website.ipfsHash) {
      throw new Error("Website hash not found !")
    }

    const traits = {
      width: "400px",
      height: "200px",
      font: "Roboto",
    }

    const adParcelId = uuidv4()
    const traitsHash = await pinAdParcelTraits(traits, adParcelId)

    writeAdParcel({
      id: uuidv4(),
      minBid: 1,
      traitsHash,
      websiteInfoHash: website?.ipfsHash,
    })
  }

  async function getTraits(adParcel: AdParcel): Promise<AdParcelTraits | null> {
    const traits = await getTraitsByHash(adParcel.traitsHash)
    return traits
  }

  async function getAdParcelWebsite(
    adParcel: AdParcel
  ): Promise<Website | null> {
    const website = adParcel.websiteInfoHash
      ? await getWebsiteByHash(adParcel.websiteInfoHash)
      : null
    return website
  }

  async function getAdParcel(adParcelId: string) {
    const adParcel = await getAdParcelById(adParcelId)

    if (!adParcel) return

    const adParcelTraits = await getTraits(adParcel)
    const adParcelWebsite = await getAdParcelWebsite(adParcel)
    console.log("Adparcel: ", adParcel)
    console.log("Traits: ", adParcelTraits)
    console.log("Website: ", adParcelWebsite)
  }

  async function createAdContent() {
    setLoading(true)

    const content = {
      title: "Opensea",
      description: "Biggest NFT marketplace!",
      linkUrl: "https://opensea.io/fr",
    }

    if (!file) {
      console.error("No file selected")
      return
    }

    const fileBuffer = await fileToBuffer(file)
    const blob = new Blob([fileBuffer], { type: file.type })
    const formData = new FormData()
    formData.append("file", blob, `${content.title}`)

    const hash = await pinFile(formData)

    console.log("Image hash: ", hash)
  }

  return (
    <main className="min-h-[100vh] flex items-center justify-center pt-20">
      <div className="flex flex-col gap-4">
        {loading ? (
          <LoaderSmall />
        ) : (
          <div className="flex flex-col gap-4">
            <Button onClick={() => storeWebsiteMetadata()}>
              Store website metadata
            </Button>
          </div>
        )}
        <Button onClick={() => createAdParcel()}>Create ad parcel</Button>
        <Button onClick={() => createAdContent()}>Create ad content</Button>
        <Button
          onClick={() => getAdParcel("017c1dd5-359a-4b16-94bb-32545f244ddf")}
        >
          Get ad parcel
        </Button>
        <Button onClick={() => console.log(website)}>Check website</Button>
        <Input type="file" onChange={(e) => onSelectMedia(e)}></Input>
        <Button onClick={() => console.log(file)}>Check file</Button>
      </div>
    </main>
  )
}
