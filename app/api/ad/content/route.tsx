import { addAdContentToUser } from "@/lib/actions/server/firebase-actions"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { uid, adContent } = await req.json()
    await addAdContentToUser(uid, adContent)
    return NextResponse.json({ adContent })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to add client" }, { status: 500 })
  }
}
