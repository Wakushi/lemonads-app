import { getAllImpressions } from "@/lib/actions/server/firebase-actions"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const impressions = await getAllImpressions()
    const response = NextResponse.json({ impressions })

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
