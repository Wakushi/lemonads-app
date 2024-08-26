import { PINATA_GATEWAY_BASE_URL } from "@/lib/constants"
import { AdContent } from "@/lib/types/ad-content.type"
import { AdParcelTraits } from "@/lib/types/ad-parcel.type"
import { Website } from "@/lib/types/website.type"

export async function pinWebsiteMetadata(website: Website): Promise<Website> {
  if (website.ipfsHash) {
    await unpinFile(website.ipfsHash)
    delete website.ipfsHash
  }

  const response = await fetch("/api/ipfs/json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      json: website,
      filename: website.name,
    }),
  })

  const { IpfsHash } = await response.json()
  return { ...website, ipfsHash: IpfsHash }
}

export async function pinAdParcelTraits(
  adParcelTraits: AdParcelTraits,
  adParcelId: string
): Promise<string> {
  const response = await fetch("/api/ipfs/json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      json: adParcelTraits,
      filename: adParcelId,
    }),
  })

  const { IpfsHash } = await response.json()
  return IpfsHash
}

export async function pinAdContent(
  adContent: AdContent,
  adParcelId: number
): Promise<string> {
  const response = await fetch("/api/ipfs/json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      json: adContent,
      filename: adParcelId,
    }),
  })

  const { IpfsHash } = await response.json()
  return IpfsHash
}

export async function getTraitsByHash(
  hash: string
): Promise<AdParcelTraits | null> {
  const response = await fetch(`${PINATA_GATEWAY_BASE_URL}/${hash}`)
  const data = await response.json()
  return (data as AdParcelTraits) || null
}

export async function getWebsiteByHash(hash: string): Promise<Website | null> {
  const response = await fetch(`${PINATA_GATEWAY_BASE_URL}/${hash}`)
  const data = await response.json()
  return (data as Website) || null
}

export async function getAdContentByHash(
  hash: string
): Promise<AdContent | null> {
  const response = await fetch(`${PINATA_GATEWAY_BASE_URL}/${hash}`)
  const data = await response.json()
  return (data as AdContent) || null
}

export async function pinFile(formData: FormData): Promise<string> {
  const response = await fetch("/api/ipfs/file", {
    method: "POST",
    body: formData,
  })

  const { IpfsHash } = await response.json()
  return IpfsHash
}

export async function unpinFile(hash: string): Promise<void> {
  const response = await fetch("/api/ipfs", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      hash,
    }),
  })

  await response.json()
}
