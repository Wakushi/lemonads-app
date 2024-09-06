import {
  LEMONADS_CONTRACT_ABI,
  LEMONADS_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { NextRequest, NextResponse } from "next/server"
import { createPublicClient, createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { baseSepolia } from "viem/chains"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { id, minBid, owner, traitsHash, websiteInfoHash } = await req.json()
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x`)

    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL),
    })

    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL),
    })

    const { request: writeAdParcelRequest } =
      await publicClient.simulateContract({
        account: walletClient.account,
        address: LEMONADS_CONTRACT_ADDRESS,
        abi: LEMONADS_CONTRACT_ABI,
        functionName: "createAdParcel",
        args: [id, minBid, owner, traitsHash, websiteInfoHash],
      })

    const result = await walletClient.writeContract(writeAdParcelRequest)

    return NextResponse.json({ result })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to create parcel" + error },
      { status: 500 }
    )
  }
}
