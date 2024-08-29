import { AdParcel } from "@/lib/types/ad-parcel.type"
import { createWalletClient, custom, Address, parseEther } from "viem"
import RPC from "@/lib/web3/viemRPC"
import { web3AuthInstance } from "@/lib/web3/Web3AuthConnectorInstance"
import {
  LEMONADS_CONTRACT_ABI,
  LEMONADS_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { simulateContract, writeContract, readContract } from "@wagmi/core"
import { config } from "@/providers"

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
}: WriteAdParcelArgs) {
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

export async function getAllPublisherAdParcels(
  address: Address
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
    if (!adParcel) continue
    adParcels.push(adParcel)
  }

  return adParcels
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

  return {
    ...adParcel,
    id: adParcelId,
    bid: Number(adParcel.bid),
    minBid: Number(adParcel.minBid),
  } as AdParcel
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
  } catch (error) {
    console.error("Error renting ad parcel:", error)
    throw new Error("Failed to rent ad parcel")
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
  } catch (error) {
    console.error("Error running aggregate clicks:", error)
    throw new Error("Failed to run aggregate clicks")
  }
}
