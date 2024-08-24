"use client"

import { useConnect } from "wagmi"
import { Button } from "@/components/ui/button"
import SignupForm from "@/components/signup-form"
import { useEffect } from "react"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useUser } from "@/service/user.service"

export default function SignUpPage() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (user.registered && user.type) {
        router.push(user.type.toLowerCase())
        return
      }
    }
  }, [user])

  if (loading) {
    return (
      <div className="mx-auto flex flex-col justify-center items-center gap-4 pt-20 h-[100vh]">
        <LoaderSmall />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto flex flex-col justify-center items-center gap-4 pt-20 h-[100vh]">
        <Connectors />
      </div>
    )
  }

  return (
    <div className="mx-auto flex flex-col justify-center items-center gap-4 pt-20 h-[100vh]">
      <SignupForm />
    </div>
  )
}

function Connectors() {
  const { connect, connectors } = useConnect()

  return (
    <div className="flex flex-col gap-4">
      {connectors.map((connector) => {
        const { id, icon, name } = connector
        return (
          <Button
            className="bg-brand px-8 flex gap-2"
            key={id}
            onClick={() => connect({ connector })}
          >
            Signup using {name}
            {icon && <ConnectorIcon url={icon} name={name} />}
          </Button>
        )
      })}
    </div>
  )
}

function ConnectorIcon({ url, name }: { url: string; name: string }) {
  return (
    <div className="w-[20px] h-[20px]">
      <Image width="100" height="100" src={url} alt={name}></Image>
    </div>
  )
}
