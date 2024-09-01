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

const locks = new Map<string, boolean>()

function acquireLock(uuid: string): boolean {
  if (locks.get(uuid)) {
    console.log("uuid locked: " + uuid)
    return false
  }

  console.log("locking uuid: " + uuid)
  locks.set(uuid, true)
  return true
}

function releaseLock(uuid: string): void {
  console.log("Releasing lock on " + uuid)
  locks.delete(uuid)
}

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

  if (!acquireLock(uuid)) {
    return NextResponse.json(
      { message: "Request is already being processed." },
      { status: 409 }
    )
  }

  try {
    const success = await processUuid(uuid, async () => {
      // Purify the potential duplicates in the notificationList array

      for (let renterAddress of notificationList) {
        if (!renterAddress) return

        const renter = await getUserByAddress(renterAddress.toLowerCase())

        if (!renter || !renter.email) {
          return
        }

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
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  } finally {
    releaseLock(uuid)
  }
}
