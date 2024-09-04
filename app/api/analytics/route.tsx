import { BetaAnalyticsDataClient } from "@google-analytics/data"
import { NextRequest, NextResponse } from "next/server"

function getDefaultStartDate(): string {
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  return date.toISOString().split("T")[0] // YYYY-MM-DD
}

// PROTECT THIS ROUTE - USERS ONLY
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const propertyId = searchParams.get("propertyId")
  const startDate = searchParams.get("startDate") || getDefaultStartDate()

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

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate: "today",
        },
      ],
      metrics: [
        { name: "activeUsers" },
        { name: "engagementRate" },
        { name: "sessions" },
        { name: "sessionsPerUser" },
        { name: "averageSessionDuration" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
      ],
    })

    if (response.rows && response.rows.length > 0) {
      const metricsResult = response.rows.map((row) => {
        if (!row.metricValues) return
        return {
          activeUsers: row.metricValues[0].value,
          engagementRate: Number(row.metricValues[1].value) * 100,
          sessions: row.metricValues[2].value,
          sessionsPerUser: row.metricValues[3].value,
          averageSessionDuration: Math.ceil(Number(row.metricValues[4].value)),
          screenPageViews: row.metricValues[5].value,
          bounceRate: Number(row.metricValues[6].value) * 100,
        }
      })

      return NextResponse.json({
        metrics: metricsResult[0],
      })
    }

    return NextResponse.json({ metrics: null })
  } catch (error) {
    return NextResponse.json({ metrics: null }, { status: 500 })
  }
}
