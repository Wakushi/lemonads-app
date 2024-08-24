"use client"

import { IoMdLogOut } from "react-icons/io"
import { comfortaa } from "@/lib/fonts"
import { LiaLemon } from "react-icons/lia"
import Link from "next/link"
import { useDisconnect } from "wagmi"
import { useUser } from "@/lib/hooks/useUser"
import TooltipWrapper from "./ui/custom-tooltip"

export default function Header() {
  const { user } = useUser()
  const { disconnect } = useDisconnect()

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-white bg-opacity-[0.02] shadow-sm backdrop-blur-sm z-10 shadow-2xl z-[99]">
      <Logo />
      <div className="flex items-center gap-4">
        <Navlink href="/" label="Home" />
        {!user?.registered && <Navlink href="/signup" label="Signup" />}
        {user && (
          <TooltipWrapper message="Disconnect wallet">
            <IoMdLogOut
              className="text-2xl text-brand cursor-pointer hover:opacity-80"
              onClick={() => disconnect()}
            />
          </TooltipWrapper>
        )}
      </div>
    </header>
  )
}

function Logo() {
  return (
    <Link
      href="/"
      className={`${comfortaa.className} flex text-2xl font-semibold text-brand items-center`}
    >
      <span>Lem</span>
      <LiaLemon />
      <span>nAds</span>
    </Link>
  )
}

function Navlink({ href, label }: { href: string; label: string }) {
  return (
    <Link className="text-brand text-lg hover:underline" href={href}>
      {label}
    </Link>
  )
}
