"use client"

import { useConnect } from "wagmi"
import { useUser } from "@/lib/hooks/useUser"
import useHasMounted from "@/lib/hooks/useHasMounted"
import { Button } from "@/components/ui/button"
import SignupForm from "@/components/signup-form"
import { useEffect, useState } from "react"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [isRegistered, setIsRegistered] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      if (user.registered && user.type) {
        router.push(user.type.toLowerCase())
        return
      }
    }
  }, [user])

  function getSignupDisplay() {
    if (loading) {
      return <LoaderSmall />
    }

    if (!user) {
      return <Connectors />
    }

    if (user && !isRegistered) {
      return <SignupForm user={user} />
    }
  }

  return (
    <div className="m-auto flex flex-col justify-center items-center gap-8  h-[100vh]">
      <h1 className="font-bold uppercase text-6xl">Signup</h1>
      {getSignupDisplay()}
    </div>
  )
}

function Connectors() {
  const { connect, connectors } = useConnect()

  const hasMounted = useHasMounted()

  if (!hasMounted) return <LoaderSmall />

  return (
    <div className="flex flex-col gap-4">
      {connectors.map((connector) => {
        return (
          <Button
            className="bg-brand px-8"
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            Signup using {connector.name}
          </Button>
        )
      })}
    </div>
  )
}
