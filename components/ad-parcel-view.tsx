import { useState, useEffect } from "react"
import { AdParcel } from "@/lib/types/ad-parcel.type"
import { User } from "@/lib/types/user.type"
import AdParcelCard from "@/components/ad-parcel-card"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import { getAllParcels } from "@/lib/actions/onchain/contract-actions"

interface AdParcelViewProps {
  user: User
}

export default function AdParcelView({ user }: AdParcelViewProps) {
  const [adParcels, setAdParcels] = useState<AdParcel[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchRentedParcels() {
      const allAdParcels = await getAllParcels(true)
      const rentedParcels = allAdParcels.filter(
        (parcel) => parcel.renter === user.address
      )
      setAdParcels(rentedParcels)
      setLoading(false)
    }

    fetchRentedParcels()
  }, [user.address])

  if (loading) {
    return (
      <div className="pt-20 flex items-center justify-center">
        <LoaderSmall />
      </div>
    )
  }

  if (adParcels.length === 0) {
    return (
      <div className="pt-20 min-h-[100vh] flex items-center justify-center">
        <p className="text-4xl">You have not rented any ad parcels yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {adParcels.map((parcel) => (
        <AdParcelCard
          key={parcel.id}
          parcel={parcel}
          user={user}
          adCampaigns={[]}
        />
      ))}
    </div>
  )
}
