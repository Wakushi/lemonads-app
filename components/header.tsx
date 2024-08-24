"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useConnect, useDisconnect } from "wagmi"
import { comfortaa } from "@/lib/fonts"
import { LiaLemon } from "react-icons/lia"
import useHasMounted from "@/lib/hooks/useHasMounted"
import { Button } from "./ui/button"
import { useUser } from "@/lib/hooks/useUser"

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-amber-500">
      <Logo />
      <Connectors />
    </header>
  )
}

function Logo() {
  return (
    <div
      className={`${comfortaa.className} flex text-2xl font-semibold text-white items-center`}
    >
      <span>Lem</span>
      <LiaLemon />
      <span>nAds</span>
    </div>
  )
}

function Connectors() {
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { user } = useUser()

  function checkUser() {
    console.log("user: ", user)
  }

  const hasMounted = useHasMounted()

  if (!hasMounted) return <span>Not mounted</span>

  return (
    <div>
      <DropdownMenu>
        {user ? (
          <div className="flex items-center gap-2">
            <Button onClick={() => disconnect()}>Disconnect</Button>
            <Button onClick={checkUser}>Info</Button>
          </div>
        ) : (
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Connect</Button>
          </DropdownMenuTrigger>
        )}
        <DropdownMenuContent>
          {connectors.map((connector) => {
            return (
              <DropdownMenuItem key={connector.id}>
                <Button
                  variant="secondary"
                  onClick={() => connect({ connector })}
                >
                  {connector.name}
                </Button>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
