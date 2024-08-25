import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
