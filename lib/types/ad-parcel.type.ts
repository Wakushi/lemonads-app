import { Address } from "viem"

type AdParcelTraits = {
  width: string
  height: string
  font: string
}

export type AdParcel = {
  id: string
  siteMetadata: string
  bid: number
  minBid: number
  owner: Address
  renter: Address
  active: boolean
  traits: AdParcelTraits
}
