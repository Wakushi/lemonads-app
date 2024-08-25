import { Address } from "viem"

export type AdParcelTraits = {
  width: string
  height: string
  font: string
}

export type AdParcel = {
  id: string
  bid: number
  minBid: number
  owner: Address
  renter: Address
  traitsHash: string
  contentHash?: string
  websiteInfoHash?: string
  active: boolean
  traits: AdParcelTraits
}
