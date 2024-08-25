import { AdContent } from "@/lib/types/ad-content.type"
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

/**
 * @function pinAdParcelTraits
 * @description This function pins the traits or metadata of an ad parcel to IPFS.
 * It sends a POST request to the `/api/ipfs/json` endpoint, which uploads the
 * ad parcel traits as a JSON object to IPFS. The resulting IPFS hash is returned.
 *
 * @param {AdParcelTraits} adParcelTraits - The traits or metadata of the ad parcel
 * (e.g., dimensions, format, responsiveness).
 * @param {string} adParcelId - A unique identifier for the ad parcel, used as the filename
 * when pinning the data to IPFS.
 * @returns {Promise<string>} - A promise that resolves to the IPFS hash of the pinned data.
 *
 * @example
 * const ipfsHash = await pinAdParcelTraits(traits, "parcel123");
 * console.log(ipfsHash); // Logs the new IPFS hash
 */
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

/**
 * @function pinAdContent
 * @description This function pins the content of an ad to IPFS. It sends a POST request to
 * the `/api/ipfs/json` endpoint, which uploads the ad content as a JSON object to IPFS.
 * The resulting IPFS hash is returned.
 *
 * @param {AdContent} adContent - The content of the ad, including text, images, links, etc.
 * @param {string} adParcelId - A unique identifier for the ad parcel, used as the filename
 * when pinning the content to IPFS.
 * @returns {Promise<string>} - A promise that resolves to the IPFS hash of the pinned ad content.
 *
 * @example
 * const ipfsHash = await pinAdContent(content, "parcel123");
 * console.log(ipfsHash); // Logs the new IPFS hash
 */
export async function pinAdContent(
  adContent: AdContent,
  adParcelId: string
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

/**
 * @function getTraitsByHash
 * @description This function retrieves the traits or metadata of an ad parcel from IPFS
 * using its IPFS hash. It sends a GET request to the Pinata gateway with the given hash
 * and parses the response as `AdParcelTraits`.
 *
 * @param {string} hash - The IPFS hash used to retrieve the ad parcel traits.
 * @returns {Promise<AdParcelTraits | null>} - A promise that resolves to the `AdParcelTraits`
 * object if found, or `null` if not.
 *
 * @example
 * const traits = await getTraitsByHash("QmExampleHash");
 * console.log(traits); // Logs the ad parcel traits retrieved from IPFS
 */
export async function getTraitsByHash(
  hash: string
): Promise<AdParcelTraits | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_BASE_URL}/${hash}`
  )
  const data = await response.json()
  return (data as AdParcelTraits) || null
}

/**
 * @function getWebsiteByHash
 * @description This function retrieves the metadata of a website from IPFS using its IPFS hash.
 * It sends a GET request to the Pinata gateway with the given hash and parses the response as a
 * `Website` object.
 *
 * @param {string} hash - The IPFS hash used to retrieve the website metadata.
 * @returns {Promise<Website | null>} - A promise that resolves to the `Website` object
 * if found, or `null` if not.
 *
 * @example
 * const website = await getWebsiteByHash("QmExampleHash");
 * console.log(website); // Logs the website metadata retrieved from IPFS
 */
export async function getWebsiteByHash(hash: string): Promise<Website | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_BASE_URL}/${hash}`
  )
  const data = await response.json()
  return (data as Website) || null
}

export async function pinFile(formData: FormData): Promise<string> {
  const response = await fetch("/api/ipfs/file", {
    method: "POST",
    body: formData,
  })

  const { IpfsHash } = await response.json()
  return IpfsHash
}
