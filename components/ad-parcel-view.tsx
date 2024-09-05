import { useState, useEffect } from "react"
import { AdParcel } from "@/lib/types/ad-parcel.type"
import { User } from "@/lib/types/user.type"
import AdParcelCard from "@/components/ad-parcel-card"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import { getAllParcels } from "@/lib/actions/onchain/contract-actions"
import Link from "next/link"

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
      <div className="flex items-center justify-center">
        <LoaderSmall />
      </div>
    )
  }

  if (adParcels.length === 0) {
    return (
      <div className="pt-10 flex flex-col gap-8 items-center justify-center">
        <p className="text-2xl font-semibold">
          You have not rented any ad parcels yet.
        </p>
        <Link
          href="/marketplace"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Browse ad parcels
        </Link>
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
