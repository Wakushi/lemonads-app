"use client"

import { IoMdLogOut } from "react-icons/io"
import { comfortaa } from "@/lib/fonts"
import { LiaLemon } from "react-icons/lia"
import Link from "next/link"
import { useDisconnect } from "wagmi"
import TooltipWrapper from "./ui/custom-tooltip"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { User } from "@/lib/types/user.type"
import { useUser } from "@/service/user.service"
import { shortenAddress } from "@/lib/utils"

export default function Header() {
  const { user, loading } = useUser()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-white bg-opacity-[0.02] shadow-sm backdrop-blur-sm z-[10]">
      <Logo />
      {!loading && (
        <div className="flex items-center gap-4 fade-in-top">
          <Navlink href="/" label="Home" />
          {(!user || !user.registered) && (
            <Navlink href="/signup" label="Signup" />
          )}
          {user && user?.registered && <RegisteredUserNavOptions user={user} />}
          {user && (
            <>
              <div className="text-white bg-brand px-4 py-2 rounded-md shadow">
                {shortenAddress(user.address)}
              </div>
              <TooltipWrapper message="Disconnect wallet">
                <IoMdLogOut
                  className="text-2xl text-brand cursor-pointer hover:opacity-80"
                  onClick={() => {
                    disconnect()
                    router.push("/")
                  }}
                />
              </TooltipWrapper>
            </>
          )}
        </div>
      )}
    </header>
  )
}

function RegisteredUserNavOptions({ user }: { user: User }) {
  return (
    <>
      <Navlink href={`/${user.type!.toLowerCase()}`} label="Dashboard" />
    </>
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
  const pathname = usePathname()
  return (
    <Link
      className={clsx("text-brand text-lg underline-offset-2	 hover:underline", {
        underline: pathname === href,
      })}
      href={href}
    >
      {label}
    </Link>
  )
}
