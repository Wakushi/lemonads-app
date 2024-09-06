import {
  addConversion,
  deleteAdConversionClick,
  getConversionClickById,
  getUserByAddress,
  getUserConversions,
} from "@/lib/actions/server/firebase-actions"
import { NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import {
  LEMONADS_CONTRACT_ABI,
  LEMONADS_CONTRACT_ADDRESS,
} from "@/lib/constants"

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get("uid")

    if (!uid) {
      return NextResponse.json(
        { error: "User firebase id is required" },
        { status: 400 }
      )
    }

    const conversions = await getUserConversions(uid)

    if (!conversions) {
      return NextResponse.json({ conversions: [] })
    }

    const response = NextResponse.json({ conversions })

    return response
  } catch (error) {
    console.error("API error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 })
    }
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { clickId } = await req.json()

  try {
    const conversionClick = await getConversionClickById(clickId)

    if (!conversionClick) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL
    )

    const contract = new ethers.Contract(
      LEMONADS_CONTRACT_ADDRESS,
      LEMONADS_CONTRACT_ABI,
      provider
    )

    const data = await contract.getAdParcelById(conversionClick.adParcelId)

    const [
      bid,
      minBid,
      owner,
      renter,
      traitsHash,
      contentHash,
      websiteInfoHash,
      active,
    ] = data

    const renterUser = await getUserByAddress(renter.toLowerCase())

    if (!renterUser || !renterUser.firebaseId) {
      return NextResponse.json({ error: "Renter not found" }, { status: 404 })
    }

    await deleteAdConversionClick(conversionClick.firebaseId)

    await addConversion({
      userFirebaseId: renterUser.firebaseId,
      adParcelId: conversionClick.adParcelId,
      clickId,
      contentHash,
      websiteInfoHash,
    })

    return NextResponse.json({ message: "Ok" })
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
