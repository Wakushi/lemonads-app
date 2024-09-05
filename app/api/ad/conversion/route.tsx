import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    return NextResponse.json({ message: "" })
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
