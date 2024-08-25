import { adParcelMock } from "@/lib/data/ad-parcel-mock"
import { AdParcel } from "@/lib/types/ad-parcel.type"

interface WriteAdParcelArgs {
  id: string
  minBid: number
  traitsHash: string
  websiteInfoHash: string
}

export async function writeAdParcel({
  id,
  minBid,
  traitsHash,
  websiteInfoHash,
}: WriteAdParcelArgs) {
  console.log(id, minBid, traitsHash, websiteInfoHash)
  // TODO : Call createAdParcel(parcelId, minBid, traitsHash, websiteInfoHash) on contract
}

export async function getAdParcelById(
  adParcelId: string
): Promise<AdParcel | null> {
  // TODO : Call getAdParcelById(parcelId) on contract
  return { ...adParcelMock, id: adParcelId } // Temporary mock response
}
