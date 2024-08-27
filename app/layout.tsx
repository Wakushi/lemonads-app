import type { Metadata } from "next"

import "./globals.css"
import Header from "@/components/header"
import { roboto } from "@/lib/fonts"
import Providers from "@/providers"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Lemonads",
  description: "Transparent ads protocol",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`${roboto.className} pt-20`}>
        <Providers>
          <Header />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
