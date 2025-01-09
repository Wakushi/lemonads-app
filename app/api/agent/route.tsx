import { processUuid } from "@/lib/actions/server/firebase-actions"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { parseEther } from "viem"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json()
  const { uuid, ownerAddress } = body

  const authorization = headers().get("authorization")
  const token = authorization && authorization.split(" ")[1]
  const secret = process.env.SECRET

  if (token !== secret) {
    return NextResponse.json({ message: "Invalid token." }, { status: 401 })
  }

  if (!ownerAddress) {
    return NextResponse.json(
      { message: "Missing owner address" },
      { status: 400 }
    )
  }

  if (!uuid) {
    return NextResponse.json({ message: "Missing uuid" }, { status: 400 })
  }

  try {
    let token = ""
    let action = "WAIT"
    let amount = "0"

    // const success = await processUuid(uuid, async () => {
    //   console.log(`Processing UUID ${uuid} for ${ownerAddress}`)

    //   action = "BUY"
    //   token = "0x33A3303eE744f2Fd85994CAe5E625050b32db453"
    //   amount = parseEther("10").toString()
    // })

    console.log(`Processing UUID ${uuid} for ${ownerAddress}`)

    return NextResponse.json(
      {
        action: "BUY",
        token: "0x33A3303eE744f2Fd85994CAe5E625050b32db453",
        amount: "",
      },
      { status: 200 }
    )

    // if (!success) {
    //   return NextResponse.json(
    //     { action: "WAIT", token: "", amount: "" },
    //     { status: 200 }
    //   )
    // }

    // return NextResponse.json({ action, token, amount }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
