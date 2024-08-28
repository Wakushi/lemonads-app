import { getAllClicks } from "@/lib/actions/server/firebase-actions"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const clicks = await getAllClicks()
    const response = NextResponse.json({ clicks })

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
