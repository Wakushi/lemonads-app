import {
  getUserByAddress,
  processUuid,
} from "@/lib/actions/server/firebase-actions"
import { getTemplate, sendMail } from "@/service/mail.service"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import {
  LEMONADS_CONTRACT_ABI,
  LEMONADS_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { Address, formatEther } from "viem"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json()
  const { uuid, notificationList } = body

  const authorization = headers().get("authorization")
  const token = authorization && authorization.split(" ")[1]
  const secret = process.env.SECRET

  if (token !== secret) {
    return NextResponse.json({ message: "Invalid token." }, { status: 401 })
  }

  if (!notificationList) {
    return NextResponse.json(
      { message: "Missing renter address" },
      { status: 400 }
    )
  }

  if (!uuid) {
    return NextResponse.json({ message: "Missing uuid" }, { status: 400 })
  }

  try {
    const success = await processUuid(uuid, async () => {
      const uniqueNotificationList = [...new Set(notificationList)] as Address[]

      for (let renterAddress of uniqueNotificationList) {
        if (!renterAddress) continue

        const renter = await getUserByAddress(renterAddress.toLowerCase())

        if (!renter || !renter.email) continue

        const provider = new ethers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL
        )

        const contract = new ethers.Contract(
          LEMONADS_CONTRACT_ADDRESS,
          LEMONADS_CONTRACT_ABI,
          provider
        )

        const balance = await contract.getRenterFundsAmount(renter.address)

        await sendMail({
          to: renter.email!,
          subject: "Lemonads - Low funds",
          template: getTemplate(renter, formatEther(balance)),
        })
      }
    })

    if (!success) {
      return NextResponse.json(
        { message: "Request is already being processed." },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: "Notifications sent successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
