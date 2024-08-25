import { NextRequest, NextResponse } from "next/server"
import { pinFileToIPFS } from "@/lib/actions/server/pinata-actions"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData()

  const file = formData.get("file")
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = file.name.replaceAll(" ", "_")

  try {
    const { IpfsHash } = await pinFileToIPFS(buffer, filename)

    return NextResponse.json({ IpfsHash, status: 201 })
  } catch (error) {
    console.log("Error occured ", error)
    return NextResponse.json({ Message: "Failed", status: 500 })
  }
}
