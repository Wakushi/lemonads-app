import { AdParcel } from "@/lib/types/ad-parcel.type"
import {
  createWalletClient,
  custom,
  Address,
  parseEther,
  formatEther,
  formatUnits,
} from "viem"
import RPC from "@/lib/web3/viemRPC"
import { web3AuthInstance } from "@/lib/web3/Web3AuthConnectorInstance"
import {
  LEMONADS_CONTRACT_ABI,
  LEMONADS_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { simulateContract, writeContract, readContract } from "@wagmi/core"
import { config } from "@/providers"
import { getAdContentByHash, getWebsiteByHash } from "../client/pinata-actions"
import { getWebsiteAnalytics } from "../client/firebase-actions"

interface WriteAdParcelArgs {
  account: Address
  id: number
  minBid: number
  traitsHash: string
  websiteInfoHash: string
}

export async function writeAdParcel({
  account,
  id,
  minBid,
  traitsHash,
  websiteInfoHash,
}: WriteAdParcelArgs): Promise<any> {
  if (!web3AuthInstance.provider) {
    throw new Error("Failed to create ad parcel: missing provider")
  }

  if (!account) {
    throw new Error("Failed to create ad parcel: missing account")
  }

  try {
    const walletClient = createWalletClient({
      account,
      chain: RPC.getViewChain(web3AuthInstance.provider),
      transport: custom(web3AuthInstance.provider),
    })

    const { request: writeAdParcelRequest } = await simulateContract(config, {
      account: walletClient.account,
      address: LEMONADS_CONTRACT_ADDRESS,
      abi: LEMONADS_CONTRACT_ABI,
      functionName: "createAdParcel",
      args: [id, minBid, traitsHash, websiteInfoHash],
    })

    const result = await writeContract(config, writeAdParcelRequest)

    return result
  } catch (error) {
    console.error("Error creating ad parcel:", error)
    throw new Error("Failed to create ad parcel")
  }
}

export async function getAdParcelById(
  adParcelId: number
): Promise<AdParcel | null> {
  const adParcel: any = await readContract(config, {
    address: LEMONADS_CONTRACT_ADDRESS,
    abi: LEMONADS_CONTRACT_ABI,
    functionName: "getAdParcelById",
    args: [adParcelId],
  })

  const website = await getWebsiteByHash(adParcel.websiteInfoHash)

  let content

  if (adParcel.contentHash) {
    content = await getAdContentByHash(adParcel.contentHash)
  }

  return {
    ...adParcel,
    id: adParcelId,
    bid: Number(adParcel.bid),
    minBid: Number(adParcel.minBid),
    website,
    content,
  } as AdParcel
}

export async function getLastCronTimestamp(): Promise<number> {
  const timestamp: any = await readContract(config, {
    address: LEMONADS_CONTRACT_ADDRESS,
    abi: LEMONADS_CONTRACT_ABI,
    functionName: "getLastCronTimestamp",
  })

  return Number(timestamp)
}

interface WriteRentAdParcelArgs {
  account: Address
  adParcelId: number
  newBid: number
  contentHash: string
}

export async function writeRentAdParcel({
  account,
  adParcelId,
  newBid,
  contentHash,
}: WriteRentAdParcelArgs) {
  if (!web3AuthInstance.provider) {
    throw new Error("Failed to create ad parcel: missing provider")
  }

  if (!account) {
    throw new Error("Failed to create ad parcel: missing account")
  }

  try {
    const walletClient = createWalletClient({
      account,
      chain: RPC.getViewChain(web3AuthInstance.provider),
      transport: custom(web3AuthInstance.provider),
    })

    const value = parseEther((newBid * 10).toString())

    const { request: writeRentAdParcelRequest } = await simulateContract(
      config,
      {
        account: walletClient.account,
        address: LEMONADS_CONTRACT_ADDRESS,
        abi: LEMONADS_CONTRACT_ABI,
        functionName: "rentAdParcel",
        args: [adParcelId, parseEther(newBid.toString()), contentHash],
        value,
      }
    )

    const result = await writeContract(config, writeRentAdParcelRequest)

    return result
  } catch (error: any) {
    throw new Error(error.metaMessages[0])
  }
}

interface WriteEditAdParcelTraitsArg {
  account: Address
  adParcelId: number
  traitsHash: string
}

export async function writeEditAdParcelTraits({
  account,
  adParcelId,
  traitsHash,
}: WriteEditAdParcelTraitsArg) {
  if (!web3AuthInstance.provider) {
    throw new Error("Failed to update ad parcel: missing provider")
  }

  if (!account) {
    throw new Error("Failed to update ad parcel: missing account")
  }

  try {
    const walletClient = createWalletClient({
      account,
      chain: RPC.getViewChain(web3AuthInstance.provider),
      transport: custom(web3AuthInstance.provider),
    })

    const { request: writeEditAdParcelTraitsRequest } = await simulateContract(
      config,
      {
        account: walletClient.account,
        address: LEMONADS_CONTRACT_ADDRESS,
        abi: LEMONADS_CONTRACT_ABI,
        functionName: "updateTraits",
        args: [adParcelId, traitsHash],
      }
    )

    const result = await writeContract(config, writeEditAdParcelTraitsRequest)

    return result
  } catch (error) {
    console.error("Error updating ad parcel:", error)
    throw new Error("Failed to update ad parcel")
  }
}

export async function runAggregateClicks(account: Address) {
  if (!web3AuthInstance.provider) {
    throw new Error("Missing provider")
  }

  if (!account) {
    throw new Error("Missing account")
  }

  try {
    const walletClient = createWalletClient({
      account,
      chain: RPC.getViewChain(web3AuthInstance.provider),
      transport: custom(web3AuthInstance.provider),
    })

    const { request: runAggregateClicksRequest } = await simulateContract(
      config,
      {
        account: walletClient.account,
        address: LEMONADS_CONTRACT_ADDRESS,
        abi: LEMONADS_CONTRACT_ABI,
        functionName: "aggregateClicks",
      }
    )

    const result = await writeContract(config, runAggregateClicksRequest)

    return result
  } catch (error: any) {
    throw new Error(error.metaMessages[0])
  }
}

export async function runPayParcelOwners(account: Address) {
  if (!web3AuthInstance.provider) {
    throw new Error("Missing provider")
  }

  if (!account) {
    throw new Error("Missing account")
  }

  try {
    const walletClient = createWalletClient({
      account,
      chain: RPC.getViewChain(web3AuthInstance.provider),
      transport: custom(web3AuthInstance.provider),
    })

    const { request: payParcelOwnersRequest } = await simulateContract(config, {
      account: walletClient.account,
      address: LEMONADS_CONTRACT_ADDRESS,
      abi: LEMONADS_CONTRACT_ABI,
      functionName: "payParcelOwners",
    })

    const result = await writeContract(config, payParcelOwnersRequest)

    return result
  } catch (error: any) {
    throw new Error(error.metaMessages[0])
  }
}

export async function getRenterFundsAmount(
  renterAddress: Address
): Promise<string> {
  const fundAmount: any = await readContract(config, {
    address: LEMONADS_CONTRACT_ADDRESS,
    abi: LEMONADS_CONTRACT_ABI,
    functionName: "getRenterFundsAmount",
    args: [renterAddress],
  })

  return formatEther(fundAmount)
}

export async function getClickPerAdParcel(adParcelId: number): Promise<number> {
  const clicks: any = await readContract(config, {
    address: LEMONADS_CONTRACT_ADDRESS,
    abi: LEMONADS_CONTRACT_ABI,
    functionName: "getClickPerAdParcel",
    args: [adParcelId],
  })

  return Number(clicks)
}

export async function getPayableAdParcels(): Promise<
  { adParcelId: number; clicks: number }[]
> {
  const payableAdParcelsIds: any = await readContract(config, {
    address: LEMONADS_CONTRACT_ADDRESS,
    abi: LEMONADS_CONTRACT_ABI,
    functionName: "getPayableAdParcels",
  })

  const payableAdParcels: { adParcelId: number; clicks: number }[] = []

  for (let adParcelId of payableAdParcelsIds) {
    const clicks = await getClickPerAdParcel(Number(adParcelId))
    payableAdParcels.push({
      adParcelId: Number(adParcelId),
      clicks,
    })
  }

  return payableAdParcels
}

export async function getAllParcels(
  attachWebsite = false
): Promise<AdParcel[]> {
  const adParcelIds: any = await readContract(config, {
    address: LEMONADS_CONTRACT_ADDRESS,
    abi: LEMONADS_CONTRACT_ABI,
    functionName: "getAllParcels",
  })

  const adParcels: AdParcel[] = []

  for (let parcelId of adParcelIds) {
    const adParcel = await getAdParcelById(Number(parcelId))

    if (!adParcel) continue

    if (attachWebsite && adParcel.websiteInfoHash) {
      const websiteInfo = await getWebsiteByHash(adParcel.websiteInfoHash)

      if (websiteInfo) {
        if (
          websiteInfo.analyticsPropertyId &&
          websiteInfo.analyticsPropertyId.length >= 9
        ) {
          const metrics = await getWebsiteAnalytics(
            websiteInfo.analyticsPropertyId
          )

          if (metrics) {
            websiteInfo.metrics = metrics
          }
        }

        adParcel.website = websiteInfo
      }
    }

    const bidUsd = await getPriceUsd(adParcel.bid)
    const minBidUsd = await getPriceUsd(adParcel.minBid)

    adParcels.push({
      ...adParcel,
      bidUsd,
      minBidUsd,
      owner: adParcel.owner.toLowerCase() as Address,
      renter: adParcel.renter.toLowerCase() as Address,
    })
  }

  return adParcels
}

export async function getAllPublisherAdParcels(
  address: Address,
  websiteUrl?: string
): Promise<AdParcel[]> {
  const adParcelIds: any = await readContract(config, {
    address: LEMONADS_CONTRACT_ADDRESS,
    abi: LEMONADS_CONTRACT_ABI,
    functionName: "getOwnerParcels",
    args: [address],
  })

  const adParcels: AdParcel[] = []

  for (let i = 0; i < adParcelIds.length; i++) {
    const adParcel = await getAdParcelById(Number(adParcelIds[i]))

    if (
      !adParcel ||
      !adParcel.website ||
      (websiteUrl && adParcel.website && adParcel.website.url !== websiteUrl)
    ) {
      continue
    }

    const bidUsd = await getPriceUsd(adParcel.bid)
    const minBidUsd = await getPriceUsd(adParcel.minBid)

    adParcels.push({
      ...adParcel,
      bidUsd,
      minBidUsd,
      owner: adParcel.owner.toLowerCase() as Address,
      renter: adParcel.renter.toLowerCase() as Address,
    })
  }

  return adParcels
}

export async function getEthPrice(): Promise<string> {
  const price: any = await readContract(config, {
    address: LEMONADS_CONTRACT_ADDRESS,
    abi: LEMONADS_CONTRACT_ABI,
    functionName: "getEthPrice",
  })

  return formatUnits(price, 8)
}

export async function getPriceUsd(ethAmount: number): Promise<number> {
  const ethPrice = await getEthPrice()
  const price = +ethPrice * (ethAmount / 10e17)
  return price
}

export enum ErrorType {
  Lemonads__NoPayableParcel = "Lemonads__NoPayableParcel",
  Lemonads__NotEnoughTimePassed = "Lemonads__NotEnoughTimePassed",
  Lemonads__BidLowerThanCurrent = "Lemonads__BidLowerThanCurrent",
}
