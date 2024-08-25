import { pinJSONToIPFS } from "@/lib/data/pinata-actions"
import { NextRequest, NextResponse } from "next/server"

/**
 * @notice Upload JSON to IPFS via Pinata and return the hash
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json()
    const { json, filename } = body

    const IpfsHash = await pinJSONToIPFS(json, filename)

    return new NextResponse(JSON.stringify({ IpfsHash }))
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
 * @notice Update JSON in IPFS via Pinata and return the hash
 */
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json()
    const { json, filename } = body

    const IpfsHash = await pinJSONToIPFS(json, filename)

    return new NextResponse(JSON.stringify({ IpfsHash }))
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
