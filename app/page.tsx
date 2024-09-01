"use client"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import { useEffect, useState } from "react"
import {
  getAllClicks,
  getAllImpressions,
} from "@/lib/actions/client/firebase-actions"

import { ImpressionChart } from "@/components/impressions-chart"
import { AdEvent } from "@/lib/types/interaction.type"
import { AdEventsBarChart } from "@/components/ad-events-bar-chart"

export default function Home() {
  const [impressions, setImpressions] = useState<AdEvent[]>([])
  const [clicks, setClicks] = useState<AdEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false)

  useEffect(() => {
    async function fetchEvents() {
      setLoadingEvents(true)
      const allClicks = await getAllClicks()
      const allImpressions = await getAllImpressions()
      setImpressions(allImpressions)
      setClicks(allClicks)
      setLoadingEvents(false)
    }

    fetchEvents()
  }, [])

  return (
    <main className="min-h-[100vh] flex flex-col items-center justify-center gap-8">
      {loadingEvents ? (
        <LoaderSmall />
      ) : (
        <div className="flex gap-8">
          <ImpressionChart clicks={clicks} impressions={impressions} />
          <AdEventsBarChart clicks={clicks} impressions={impressions} />
        </div>
      )}
    </main>
  )
}
