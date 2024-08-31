import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { RateLimiterMemory } from "rate-limiter-flexible"

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 1,
})

export async function middleware(request: NextRequest) {
  try {
    if (request.ip) {
      await rateLimiter.consume(request.ip)
    }

    return NextResponse.next()
  } catch (rateLimiterRes) {
    console.log("Too many request by " + request.ip)
    return new NextResponse("Too many requests", { status: 429 })
  }
}

export const config = {
  matcher: ["/api/:path*"],
}
