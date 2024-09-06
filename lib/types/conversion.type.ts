import { AdContent } from "./ad-content.type"

export type ConversionClick = {
  firebaseId: string
  adParcelId: number
  clickId: string
  timestamp: { _seconds: number; _nanoseconds: number }
}

export type Conversion = {
  firebaseId: string
  adParcelId: number
  clickId: string
  websiteInfoHash: string
  contentHash: string
  content?: AdContent
  timestamp: { _seconds: number; _nanoseconds: number }
}
