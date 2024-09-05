import { Address } from "viem"
import { Website } from "./website.type"
import { AdContent } from "./ad-content.type"

export type AdParcelTraits = {
  width?: string
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
  website?: Website
  content?: AdContent
  bidUsd?: number
  minBidUsd?: number
  active: boolean
}

// Solidity contract struct
// struct AdParcel {
//   uint256 bid; // Current highest bid for the ad parcel
//   uint256 minBid; // Minimum bid required for the ad parcel
//   address owner; // Owner of the ad parcel
//   address renter; // Current renter of the ad parcel
//   string traitsHash; // IPFS hash for parcel metadata (width, fonts..)
//   string contentHash; // IPFS hash for content
//   string websiteInfoHash; // IPFS hash for website information
//   bool active; // Is this parcel still active
// }
