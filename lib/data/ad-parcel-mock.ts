// Solidity AdParcel struct instance

import { zeroAddress } from "viem"
import { AdParcel } from "../types/ad-parcel.type"

// id: 017c1dd5-359a-4b16-94bb-32545f244ddf
export const adParcelMock: AdParcel = {
  id: "017c1dd5-359a-4b16-94bb-32545f244ddf",
  bid: 0,
  minBid: 1,
  owner: "0x35e34708c7361f99041a9b046c72ea3fcb29134c",
  renter: zeroAddress,
  traitsHash: "QmZk1W8u2Eqysw82j9vAJmqUTwg386mkBMbx1N9yeeXReR",
  websiteInfoHash: "QmNLmLZjTGMEESgYMLP7qg6samYWQVDGP1HDdnbj8Mxr7B",
  active: true,
}
