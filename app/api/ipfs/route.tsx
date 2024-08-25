import { unpinFile } from "@/lib/data/pinata-actions"
import { NextRequest, NextResponse } from "next/server"

/**
 * @notice Unpin JSON from IPFS via Pinata
 */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json()
    const { hash } = body
    await unpinFile(hash)

    return new NextResponse(JSON.stringify({ message: "Ok" }))
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
