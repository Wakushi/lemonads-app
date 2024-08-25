"use client"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import {
  getTraitsByHash,
  getWebsiteByHash,
  pinAdParcelTraits,
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
import { useUser } from "@/service/user.service"
import { createAdContent } from "@/lib/actions/client/firebase-actions"

export default function Home() {
  const { user } = useUser()
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

  async function submitAdContent() {
    if (!user) return

    const title = "Opensea"
    const description = "Biggest NFT marketplace !"
    const linkUrl = "https://opensea.io/fr"

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

    console.log("createdAdContent: ", createdAdContent)

    setLoading(false)
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
        <Button onClick={() => submitAdContent()}>Create ad content</Button>
        <Button
          onClick={() => getAdParcel("017c1dd5-359a-4b16-94bb-32545f244ddf")}
        >
          Get ad parcel
        </Button>
        <Button onClick={() => console.log(website)}>Check website</Button>
        <Button onClick={() => console.log(user)}>Check user</Button>
        <Input type="file" onChange={(e) => onSelectMedia(e)}></Input>
        <Button onClick={() => console.log(file)}>Check file</Button>
      </div>
    </main>
  )
}
