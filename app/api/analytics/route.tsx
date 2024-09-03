import { BetaAnalyticsDataClient } from "@google-analytics/data"
import { NextRequest, NextResponse } from "next/server"

// PROTECT THIS ROUTE - USERS ONLY
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const propertyId = searchParams.get("propertyId")

  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        private_key: (process.env.GOOGLE_PRIVATE_KEY as string)
          .split(String.raw`\n`)
          .join("\n"),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
    })

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      )
    }
    // await analyticsDataClient.runReport for global report, runRealtimeReport for realtime (also metrics name will be different)
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [
        {
          name: "eventCount",
        },
      ],
    })

    if (response.rows && response.rows[0].metricValues) {
      const eventCount = response.rows[0].metricValues[0].value
      console.log("eventCount: ", eventCount)
    }

    return NextResponse.json({})
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 })
    }
  }
}
