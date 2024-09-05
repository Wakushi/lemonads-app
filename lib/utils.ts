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
