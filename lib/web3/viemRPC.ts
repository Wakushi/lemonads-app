import {
  createWalletClient,
  createPublicClient,
  custom,
  formatEther,
  parseEther,
  Address,
} from "viem"
import { mainnet, baseSepolia, sepolia } from "viem/chains"
import type { IProvider } from "@web3auth/base"

const getViewChain = (provider: IProvider) => {
  switch (provider.chainId) {
    case "1":
      return mainnet
    case "0x13882":
      return baseSepolia
    case "0xaa36a7":
      return sepolia
    default:
      return mainnet
  }
}

const getChainId = async (provider: IProvider): Promise<any> => {
  try {
    const walletClient = createWalletClient({
      transport: custom(provider),
    })

    const address = await walletClient.getAddresses()

    const chainId = await walletClient.getChainId()
    return chainId.toString()
  } catch (error) {
    return error
  }
}
const getAccounts = async (provider: IProvider): Promise<any> => {
  try {
    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    })

    const address = await walletClient.getAddresses()

    return address
  } catch (error) {
    return error
  }
}

const getBalance = async (
  provider: IProvider,
  userAddress?: Address
): Promise<string> => {
  try {
    const publicClient = createPublicClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    })

    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    })

    const accounts = userAddress
      ? [userAddress]
      : await walletClient.getAddresses()

    const balance = await publicClient.getBalance({ address: accounts[0] })
    return formatEther(balance)
  } catch (error) {
    return error as string
  }
}

const sendTransaction = async (provider: IProvider): Promise<any> => {
  try {
    const publicClient = createPublicClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    })

    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    })

    // data for the transaction
    const destination = "0x35E34708C7361F99041a9b046C72Ea3Fcb29134c"
    const amount = parseEther("0.01")
    const address = await walletClient.getAddresses()

    // Submit transaction to the blockchain
    const hash = await walletClient.sendTransaction({
      account: address[0],
      to: destination,
      value: amount,
    })
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    return JSON.stringify(
      receipt,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    )
  } catch (error) {
    return error
  }
}

const signMessage = async (provider: IProvider): Promise<any> => {
  try {
    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    })

    // data for signing
    const address = await walletClient.getAddresses()
    const originalMessage = "YOUR_MESSAGE"

    // Sign the message
    const hash = await walletClient.signMessage({
      account: address[0],
      message: originalMessage,
    })

    return hash.toString()
  } catch (error) {
    return error
  }
}

export default {
  getChainId,
  getAccounts,
  getBalance,
  sendTransaction,
  signMessage,
  getViewChain,
}
