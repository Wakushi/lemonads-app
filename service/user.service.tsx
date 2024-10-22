"use client"
import { createContext, ReactNode, useContext } from "react"
import { useState, useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { User } from "@/lib/types/user.type"
import { web3AuthInstance } from "@/lib/web3/Web3AuthConnectorInstance"
import RPC from "@/lib/web3/viemRPC"
import { Website } from "@/lib/types/website.type"
import { useRouter } from "next/navigation"

interface UserContextProviderProps {
  children: ReactNode
}

interface UserContextProps {
  user: User | null
  setUser: (user: User | ((prevUser: User | null) => User | null)) => void
  websites: Website[]
  setWebsites: (
    websites: Website[] | ((prevWebsites: Website[]) => Website[])
  ) => void
  loading: boolean
  disconnectWallet: () => void
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  websites: [],
  setWebsites: () => {},
  loading: false,
  disconnectWallet: () => {},
})

export default function UserContextProvider(props: UserContextProviderProps) {
  const { address, connector, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (isConnected && connector?.name !== "Web3Auth" && address) {
          const registeredUser = await getRegisteredUser(address)
          setUser(registeredUser ? registeredUser : { address })
          setLoading(false)
          return
        }

        if (isConnected && web3AuthInstance) {
          const userInfo = await web3AuthInstance.getUserInfo()
          const web3AuthAddress = await getUserAddress()

          if (!web3AuthAddress) return

          const registeredUser = await getRegisteredUser(web3AuthAddress)

          setUser(
            registeredUser
              ? registeredUser
              : {
                  address: web3AuthAddress,
                  web3AuthData: userInfo,
                }
          )
        }
      } catch (err) {
        setError("Failed to fetch user data")
      } finally {
        setLoading(false)
      }

      if (!isConnected) {
        setLoading(false)
        setUser(null)
        return
      }
    }

    fetchUserData()
  }, [isConnected, connector, address, web3AuthInstance])

  function disconnectWallet() {
    disconnect()
    setUser(null)
    router.push("/")
  }

  async function getUserAddress(): Promise<`0x${string}` | null> {
    if (!web3AuthInstance?.provider) {
      console.log("No provider")
      return null
    }

    const accounts: any[] = await RPC.getAccounts(web3AuthInstance.provider)
    return accounts && accounts.length ? accounts[0] : null
  }

  async function getRegisteredUser(address: string): Promise<User | null> {
    const response = await fetch(`/api/user?address=${address}`)
    const { registeredUser } = await response.json()
    return registeredUser
  }


  const context: UserContextProps = {
    user,
    setUser,
    websites,
    setWebsites,
    loading,
    disconnectWallet,
  }

  return (
    <UserContext.Provider value={context}>
      {props.children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
