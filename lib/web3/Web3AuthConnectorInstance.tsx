import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector"
import { Web3Auth } from "@web3auth/modal"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base"
import { polygonAmoy } from "wagmi/chains"

const chains = [polygonAmoy]
const name = "Lemonads"

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x" + chains[0].id.toString(16),
  rpcTarget: process.env.NEXT_PUBLIC_ALCHEMY_AMOY_RPC as string,
  displayName: chains[0].name,
  tickerName: chains[0].nativeCurrency?.name,
  ticker: chains[0].nativeCurrency?.symbol,
  blockExplorerUrl: chains[0].blockExplorers?.default.url[0] as string,
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

export const web3AuthInstance = new Web3Auth({
  clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID as string,
  chainConfig,
  privateKeyProvider,
  uiConfig: {
    appName: name,
    loginMethodsOrder: ["google", "github"],
    defaultLanguage: "en",
    modalZIndex: "2147483647",
    logoLight: "https://web3auth.io/images/web3authlog.png",
    logoDark: "https://web3auth.io/images/web3authlogodark.png",
    uxMode: "popup",
    mode: "light",
  },
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
})

export default function Web3AuthConnectorInstance() {
  return Web3AuthConnector({
    web3AuthInstance,
  })
}
