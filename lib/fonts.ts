import { Comfortaa } from "next/font/google"
import { Inter } from "next/font/google"
import { Roboto } from "next/font/google"

export const comfortaa = Comfortaa({ subsets: ["latin"] })
export const inter = Inter({ subsets: ["latin"] })
export const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
})
