"use client"
import { ReactNode } from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { baseSepolia } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Web3AuthConnectorInstance from "./lib/web3/Web3AuthConnectorInstance"
import UserContextProvider from "./service/user.service"

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  connectors: [Web3AuthConnectorInstance()],
})

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>{children}</UserContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
