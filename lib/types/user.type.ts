import { OpenloginUserInfo } from "@web3auth/openlogin-adapter"

export type User = {
  address: `0x${string}`
  web3AuthData?: Partial<OpenloginUserInfo>
}
