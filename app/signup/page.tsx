"use client"

import { useConnect, useDisconnect } from "wagmi"
import { useUser } from "@/lib/hooks/useUser"
import useHasMounted from "@/lib/hooks/useHasMounted"
import { Button } from "@/components/ui/button"
import SignupForm from "@/components/signup-form"
import { useEffect, useState } from "react"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const { user } = useUser()
  const router = useRouter()
  const [isRegistered, setIsRegistered] = useState<boolean>(false)

  useEffect(() => {
    console.log("User updated: ", user)
    if (user) {
      // Either it's an already registered user => to dashboard
      if (isRegistered) {
        // Figure out the type of the user publisher or annoncer
        const userType = "annoncer"
        router.push(userType)
        return
      }

      // Else we display the registration form
    }
  }, [user])

  function getSignupDisplay() {
    if (!user) {
      return <Connectors />
    }

    if (user && !isRegistered) {
      return <SignupForm />
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
