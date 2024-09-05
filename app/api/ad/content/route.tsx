import {
  addAdContentToUser,
  deleteAdContent,
  getAdContentsByUser,
} from "@/lib/actions/server/firebase-actions"
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

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get("uid")

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const adContents = await getAdContentsByUser(uid)
    return NextResponse.json(adContents)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch ad contents" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { uid, firebaseId } = await req.json()

    if (!firebaseId)
      return NextResponse.json(
        { message: "Missing firebase id" },
        { status: 400 }
      )

    await deleteAdContent(uid, firebaseId)

    return NextResponse.json({ message: "Ok" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to delete ad content" },
      { status: 500 }
    )
  }
}
