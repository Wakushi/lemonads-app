import { getAdTemplate } from "@/lib/ad-template"
import { NextRequest, NextResponse } from "next/server"

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

    return new NextResponse(
      JSON.stringify({
        htmlContent: getAdTemplate({
          id: adParcelId,
          title: "Opensea",
          description: "Biggest NFT marketplace",
          imageUrl: "https://static.opensea.io/og-images/Metadata-Image.png",
          linkUrl: "https://opensea.io/fr",
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

    const userAgent = req.headers.get("user-agent") || "Unknown"
    const ip = req.headers.get("x-forwarded-for") || req.ip || "Unknown"
    const referer = req.headers.get("referer") || "Unknown"
    const acceptLanguage = req.headers.get("accept-language") || "Unknown"
    const country = ip !== "Unknown" ? await getCountryByIP(ip) : "Unknown"

    console.log({
      adParcelId,
      ip,
      country,
      userAgent,
      referer,
      acceptLanguage,
    })

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

async function getCountryByIP(ip: string) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()
    return data.country_name || "Unknown"
  } catch (error) {
    console.error("Error fetching country:", error)
    return "Unknown"
  }
}