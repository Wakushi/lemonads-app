"use client"

import { Connector, useConnect } from "wagmi"
import { Button } from "@/components/ui/button"
import SignupForm from "@/components/signup-form"
import { useEffect, useState } from "react"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useUser } from "@/service/user.service"
import { UserType } from "@/lib/types/user.type"
import { connect } from "@wagmi/core"
import { config } from "@/providers"

export default function SignUpPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

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
      <div className="mx-auto flex flex-col justify-center items-center gap-2 pt-20 h-[100vh] max-w-[800px] text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Welcome to Lemonads!
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          We're excited to have you join our community! You have two simple
          options to get started: if you already have a crypto wallet, you can
          easily sign in using that. If not, no problem! You can use your Google
          or another account to sign up.
        </p>
        <Connectors setLoading={setLoading} />
      </div>
    )
  }

  return (
    <div className="mx-auto flex flex-col justify-center items-center gap-8 pt-20 h-[100vh] max-w-lg text-center px-4">
      <h1 className="text-3xl font-semibold mb-4">Complete Your Signup</h1>
      <p className="text-gray-600 mb-6">
        You're almost there! Please fill in the following details to complete
        your signup process.
      </p>
      <SignupForm type={searchParams?.type as UserType} />
    </div>
  )
}

function Connectors({ setLoading }: { setLoading: (state: boolean) => void }) {
  const { connectors } = useConnect()

  async function handleConnect(connector: Connector) {
    setLoading(true)

    connect(config, { connector }).catch(() => {
      setLoading(false)
    })
  }

  return (
    <div className="flex flex-col items-center justify-center  gap-4 w-full">
      {connectors.map((connector) => {
        const { id, icon, name } = connector
        return (
          <Button
            className="bg-brand px-8 flex gap-2 items-center justify-center w-full max-w-[250px]"
            key={id}
            onClick={() => {
              handleConnect(connector)
            }}
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
