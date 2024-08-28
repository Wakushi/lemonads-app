import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address } from "viem"
import { AdEvent } from "./types/interaction.type"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fileToBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as ArrayBuffer)
      } else {
        reject(new Error("Failed to read file as buffer"))
      }
    }

    reader.onerror = () => {
      reject(reader.error)
    }

    reader.readAsArrayBuffer(file)
  })
}

export function shortenAddress(address: Address): string {
  if (!address) {
    throw new Error("Invalid address")
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function uuidToUint256(uuid: string) {
  const hexString = uuid.replace(/-/g, "")
  const bigIntValue = BigInt("0x" + hexString)
  return Math.ceil(Number(bigIntValue) / 10e28)
}

export function generateRandomAdEvents(amount: number): AdEvent[] {
  const countries = [
    "France",
    "United States",
    "Germany",
    "Japan",
    "United Kingdom",
    "Australia",
    "Canada",
  ]
  const referers = [
    "https://publisher-sandbox-one.vercel.app/",
    "https://example.com/",
    "https://another-example.com/",
    "https://example.jp/",
    "https://example.co.uk/",
    "https://example.com.au/",
    "https://example.ca/",
  ]
  const userAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  ]
  const ips = [
    "85.170.113.134",
    "192.168.1.1",
    "203.0.113.0",
    "203.0.113.10",
    "203.0.113.20",
    "203.0.113.30",
    "203.0.113.40",
  ]
  const adParcelIds = [
    782576213, 782576214, 782576215, 782576216, 782576217, 782576218, 782576219,
  ]

  const getRandomElement = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)]

  const getRandomTimestamp = (): { _seconds: number; _nanoseconds: number } => {
    const now = Math.floor(Date.now() / 1000)
    const randomSeconds = now - Math.floor(Math.random() * 30 * 24 * 60 * 60) // Random timestamp within the last 30 days
    return {
      _seconds: randomSeconds,
      _nanoseconds: Math.floor(Math.random() * 1000000000),
    }
  }

  const events: AdEvent[] = []

  for (let i = 0; i < amount; i++) {
    const event: AdEvent = {
      id: `event-${i + 1}`,
      country: getRandomElement(countries),
      referer: getRandomElement(referers),
      adParcelId: getRandomElement(adParcelIds),
      acceptLanguage: "en-US,en;q=0.9",
      ip: getRandomElement(ips),
      userAgent: getRandomElement(userAgents),
      timestamp: getRandomTimestamp(),
    }

    events.push(event)
  }

  return events
}
