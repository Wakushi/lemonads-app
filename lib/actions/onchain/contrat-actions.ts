import { adParcelMock } from "@/lib/data/ad-parcel-mock"
import { AdParcel } from "@/lib/types/ad-parcel.type"
import { createWalletClient, createPublicClient, custom, Address } from "viem"
import RPC from "@/lib/web3/viemRPC"
import { web3AuthInstance } from "@/lib/web3/Web3AuthConnectorInstance"
import {
  LEMONADS_CONTRACT_ABI,
  LEMONADS_CONTRACT_ADDRESS,
} from "@/lib/constants"

interface WriteAdParcelArgs {
  id: number
  minBid: number
  traitsHash: string
  websiteInfoHash: string
}

export async function writeAdParcel({
  id,
  minBid,
  traitsHash,
  websiteInfoHash,
}: WriteAdParcelArgs) {
  if (!web3AuthInstance.provider) return

  const account = await getUserAddress()

  if (!account) return

  try {
    const walletClient = createWalletClient({
      account,
      chain: RPC.getViewChain(web3AuthInstance.provider),
      transport: custom(web3AuthInstance.provider),
    })

    const publicClient = createPublicClient({
      chain: RPC.getViewChain(web3AuthInstance.provider),
      transport: custom(web3AuthInstance.provider),
    })

    const { request: writeAdParcelRequest } =
      await publicClient.simulateContract({
        account: walletClient.account,
        address: LEMONADS_CONTRACT_ADDRESS,
        abi: LEMONADS_CONTRACT_ABI,
        functionName: "createAdParcel",
        args: [id, minBid, traitsHash, websiteInfoHash],
      })

    const result = await walletClient.writeContract(writeAdParcelRequest)

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

async function getUserAddress(): Promise<Address | null> {
  if (!web3AuthInstance?.provider) {
    console.log("No provider")
    return null
  }

  const accounts: any[] = await RPC.getAccounts(web3AuthInstance.provider)
  return accounts && accounts.length ? accounts[0] : null
}
