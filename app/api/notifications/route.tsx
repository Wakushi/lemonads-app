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
import { formatEther } from "viem"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json()
  const { uuid, notificationList } = body

  console.log("uuid: ", uuid)
  console.log("notificationList: ", notificationList)

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
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL
      )

      const uniqueNotifications = []

      for (let i = 0; i < notificationList.length; i += 2) {
        const renterAddress = notificationList[i]
        const parcelId = notificationList[i + 1]

        if (!renterAddress || !parcelId) continue

        uniqueNotifications.push({ renterAddress, parcelId })
      }

      for (let notification of uniqueNotifications) {
        console.log("notification: ", notification)

        const renter = await getUserByAddress(
          notification.renterAddress.toLowerCase()
        )
        if (!renter || !renter.email) continue

        const contract = new ethers.Contract(
          LEMONADS_CONTRACT_ADDRESS,
          LEMONADS_CONTRACT_ABI,
          provider
        )

        const budget = await contract.getRenterBudgetAmountByParcel(
          notification.parcelId,
          renter.address
        )

        console.log("budget: ", budget)

        await sendMail({
          to: renter.email!,
          subject: "Lemonads - Low funds for Parcel",
          template: getTemplate(
            renter,
            formatEther(budget),
            notification.parcelId
          ),
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
