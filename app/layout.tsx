import type { Metadata } from "next"

import "./globals.css"
import Header from "@/components/header"
import { roboto } from "@/lib/fonts"
import Providers from "@/providers"
import { Toaster } from "@/components/ui/toaster"
import DebugDrawer from "@/components/debug-drawer"

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
      <body suppressHydrationWarning={true} className={roboto.className}>
        <Providers>
          <Header />
          {children}
          <DebugDrawer />
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
