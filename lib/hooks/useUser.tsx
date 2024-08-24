import { useState, useEffect } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { User } from "@/lib/types/user.type"
import RPC from "@/lib/viemRPC"
import { web3AuthInstance } from "../Web3AuthConnectorInstance"

export function useUser() {
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isConnected) {
        setLoading(false)
        setUser(null)
        return
      }

      try {
        if (connector?.name !== "Web3Auth" && address) {
          setUser({ address })
          setLoading(false)
          return
        }

        if (web3AuthInstance) {
          const userInfo = await web3AuthInstance.getUserInfo()
          const web3AuthAddress = await getUserAddress()

          if (!web3AuthAddress) return

          setUser({
            address: web3AuthAddress,
            web3AuthData: userInfo,
          })
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err)
        setError("Failed to fetch user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isConnected, connector, address, web3AuthInstance])

  async function getUserAddress(): Promise<`0x${string}` | null> {
    if (!web3AuthInstance?.provider) {
      console.log("No provider")
      return null
    }

    const accounts: any[] = await RPC.getAccounts(web3AuthInstance.provider)
    return accounts && accounts.length ? accounts[0] : null
  }

  return { user, connect, connectors, disconnect, loading, error }
}
