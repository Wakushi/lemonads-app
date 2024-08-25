import { AdParcelTraits } from "@/lib/types/ad-parcel.type"
import { Website } from "@/lib/types/website.type"

/**
 * @function pinWebsiteMetadata
 * @description This function handles the pinning of a website's metadata to IPFS.
 * It first checks if the website already has an `ipfsHash`. If it does, it removes
 * the existing IPFS hash by sending a DELETE request to the `/api/ipfs` endpoint.
 * After removing the old hash, or if there was no previous hash, it then sends
 * a POST request to pin the updated website metadata to IPFS, storing the new IPFS hash.
 *
 * @param {Website} website - The website object containing the metadata to be pinned to IPFS.
 * @returns {Promise<Website>} - A promise that resolves to the updated website object
 * with the new `ipfsHash` included.
 *
 * @example
 * const updatedWebsite = await pinWebsiteMetadata(website);
 * console.log(updatedWebsite.ipfsHash); // Logs the new IPFS hash
 */
export async function pinWebsiteMetadata(website: Website): Promise<Website> {
  if (website.ipfsHash) {
    const response = await fetch("/api/ipfs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hash: website.ipfsHash,
      }),
    })

    await response.json()
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

export async function getTraitsByHash(
  hash: string
): Promise<AdParcelTraits | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_BASE_URL}/${hash}`
  )
  const data = await response.json()
  return (data as AdParcelTraits) || null
}

export async function getWebsiteByHash(hash: string): Promise<Website | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_BASE_URL}/${hash}`
  )
  const data = await response.json()
  return (data as Website) || null
}
