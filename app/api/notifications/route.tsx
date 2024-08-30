import {
  getUserByAddress,
  processUuid,
} from "@/lib/actions/server/firebase-actions"
import { getTemplate, sendMail } from "@/service/mail.service"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const locks = new Map<string, boolean>()

function acquireLock(uuid: string): boolean {
  if (locks.get(uuid)) {
    return false
  }

  locks.set(uuid, true)
  return true
}

function releaseLock(uuid: string): void {
  locks.delete(uuid)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json()
  const { renterAddress, uuid } = body

  const authorization = headers().get("authorization")
  const token = authorization && authorization.split(" ")[1]
  const secret = process.env.SECRET

  if (token !== secret) {
    return NextResponse.json({ message: "Invalid token." }, { status: 401 })
  }

  if (!renterAddress) {
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
    const renter = await getUserByAddress(renterAddress)

    if (!renter || !renter.email) {
      return NextResponse.json(
        { message: "Renter not found at address " + renterAddress },
        { status: 404 }
      )
    }

    const success = await processUuid(uuid, async () => {
      await sendMail({
        to: renter.email!,
        subject: "Lemonads - Payment made",
        template: getTemplate(),
      })
    })

    if (!success) {
      return NextResponse.json(
        { message: "Request is already being processed." },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json({ message: error }, { status: 500 })
  } finally {
    releaseLock(uuid)
  }
}
