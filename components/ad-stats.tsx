"use client"

import { getUserConversions } from "@/lib/actions/client/firebase-actions"
import { useUser } from "@/service/user.service"
import ConversionsChart from "./charts/conversions-chart"
import { Conversion } from "@/lib/types/conversion.type"
import { useQuery } from "@tanstack/react-query"
import LoaderSmall from "./ui/loader-small/loader-small"

export default function AdStats() {
  const { user } = useUser()

  async function fetchConversions(): Promise<Conversion[]> {
    if (!user?.firebaseId) return []

    const conversions = await getUserConversions(user?.firebaseId)
    return conversions
  }

  const { data: conversions, isLoading } = useQuery<Conversion[], Error>({
    queryKey: ["conversions", user?.firebaseId],
    queryFn: () => fetchConversions(),
  })

  if (isLoading) {
    return <LoaderSmall />
  }

  if (!conversions) {
    return <div></div>
  }

  return (
    <div>
      <ConversionsChart conversions={conversions} />
    </div>
  )
}
