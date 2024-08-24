import { OpenloginUserInfo } from "@web3auth/openlogin-adapter"

export enum UserType {
  PUBLISHER = "PUBLISHER",
  ANNOUNCER = "ANNOUNCER",
}

export type User = {
  address: `0x${string}`
  web3AuthData?: Partial<OpenloginUserInfo>
  registered?: boolean
  name?: string
  email?: string
  type?: UserType
  companyName?: string
}
