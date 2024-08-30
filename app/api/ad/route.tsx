import { getAdTemplate } from "@/lib/ad-template"
import { NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import {
  LEMONADS_CONTRACT_ABI,
  LEMONADS_CONTRACT_ADDRESS,
} from "@/lib/constants"
import {
  getAdContentByHash,
  getTraitsByHash,
} from "@/lib/actions/client/pinata-actions"
import { zeroAddress } from "viem"
import {
  getLastAdClickByIp,
  registerAdClick,
  registerAdImpression,
} from "@/lib/actions/server/firebase-actions"
import { AdEvent } from "@/lib/types/interaction.type"

/**
 * @notice Receives an adParcelId query param, find the associated ad parcel by id and returns the template
 * to be displayed in the associated website
 * @returns htmlContent as string html template
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const adParcelId = searchParams.get("adParcelId")

  try {
    if (!adParcelId) {
      const headers = new Headers({
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      })

      return new NextResponse(
        JSON.stringify({ error: "Ad parcel id is missing" }),
        {
          status: 400,
          headers,
        }
      )
    }

    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Content-Type": "application/json",
    })

    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL
    )

    const contract = new ethers.Contract(
      LEMONADS_CONTRACT_ADDRESS,
      LEMONADS_CONTRACT_ABI,
      provider
    )

    const data = await contract.getAdParcelById(adParcelId)

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

    if (renter === zeroAddress || !contentHash || !active) {
      return new NextResponse(
        JSON.stringify({ error: "No content available" }),
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
    }

    const traits = await getTraitsByHash(traitsHash)
    const adContent = await getAdContentByHash(contentHash)

    if (!traits || !adContent) {
      return new NextResponse(
        JSON.stringify({ error: "No content available" }),
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
    }

    const interactionDetails = await getInteractionDetails(req)
    registerAdImpression(+adParcelId, interactionDetails)

    return new NextResponse(
      JSON.stringify({
        htmlContent: getAdTemplate({
          traits,
          adContent,
        }),
      }),
      { headers }
    )
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
  }
}

/**
 * @notice Request received on ad parcel click
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { adParcelId } = await req.json()
    const interactionDetails = await getInteractionDetails(req)

    const lastAdClick = await getLastAdClickByIp(
      interactionDetails.ip,
      adParcelId
    )

    if (
      process.env.NODE_ENV === "production" &&
      lastAdClick &&
      lastAdClick.timestamp?._seconds
    ) {
      const ONE_DAY = 86400
      const lastClickedAt = lastAdClick.timestamp?._seconds * 1000

      if (Date.now() < lastClickedAt + ONE_DAY) {
        console.log(
          `Too many request by ${interactionDetails.ip} on ad parcel ID:${adParcelId}`
        )
        return new NextResponse(null, {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        })
      }
    }

    registerAdClick(adParcelId, interactionDetails)

    return new NextResponse(JSON.stringify({ message: "Ok" }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
  }
}

async function getInteractionDetails(req: NextRequest): Promise<AdEvent> {
  const userAgent = req.headers.get("user-agent") || "Unknown"
  const ip = req.headers.get("x-forwarded-for") || req.ip || "Unknown"
  const referer = req.headers.get("referer") || "Unknown"
  const acceptLanguage = req.headers.get("accept-language") || "Unknown"
  const country = ip !== "Unknown" ? await getCountryByIP(ip) : "Unknown"

  return {
    ip,
    country,
    userAgent,
    referer,
    acceptLanguage,
  }
}

async function getCountryByIP(ip: string) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json`)
    const data = await response.json()
    return data.country_name || "Unknown"
  } catch (error) {
    console.error("Error fetching country:", error)
    return "Unknown"
  }
}
