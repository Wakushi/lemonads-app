import { AdParcel } from "@/lib/types/ad-parcel.type"
import { User } from "@/lib/types/user.type"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import { getAllParcels } from "@/lib/actions/onchain/contract-actions"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { AdParcelDataTable } from "./ad-parcel-data-table/ad-parcel-data-table"
import { adParcelAnnouncerColumns } from "./ad-parcel-data-table/ad-parcel-data-table-announcer-columns"

interface AdParcelViewProps {
  user: User
}

export default function AdParcelView({ user }: AdParcelViewProps) {
  async function fetchRentedParcels() {
    const allAdParcels = await getAllParcels(true)
    const rentedParcels = allAdParcels.filter(
      (parcel) => parcel.renter === user.address
    )
    return rentedParcels
  }

  const { data: rentedParcels, isLoading } = useQuery<AdParcel[], Error>({
    queryKey: ["rentedParcels", user?.address],
    queryFn: () => fetchRentedParcels(),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoaderSmall />
      </div>
    )
  }

  if (!rentedParcels || rentedParcels.length === 0) {
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
    <AdParcelDataTable
      columns={adParcelAnnouncerColumns}
      data={rentedParcels}
    />
  )
}
