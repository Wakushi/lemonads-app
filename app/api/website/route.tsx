import { addWebsiteToUser } from "@/lib/actions/server/firebase-actions"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { uid, ...websiteData } = await req.json()

    if (!uid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const result = await addWebsiteToUser(uid, websiteData)
    return NextResponse.json({ result })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to add website" }, { status: 500 })
  }
}

