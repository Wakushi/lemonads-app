import { adParcelMock } from "@/lib/data/ad-parcel-mock"
import { AdParcel } from "@/lib/types/ad-parcel.type"
import { createWalletClient, custom, Address } from "viem"
import RPC from "@/lib/web3/viemRPC"
import { web3AuthInstance } from "@/lib/web3/Web3AuthConnectorInstance"
import {
  LEMONADS_CONTRACT_ABI,
  LEMONADS_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { simulateContract, writeContract } from "@wagmi/core"
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

export async function getAdParcelById(
  adParcelId: string
): Promise<AdParcel | null> {
  // TODO : Call getAdParcelById(parcelId) on contract
  return { ...adParcelMock, id: adParcelId } // Temporary mock response
}
