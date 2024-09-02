"use client"
import { WebsiteDataTable } from "@/components/website-data-table/website-data-table"
import { columns } from "@/components/website-data-table/website-data-table-column"
import { Website } from "@/lib/types/website.type"
import { useUser } from "@/service/user.service"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import {
  getAllClicks,
  getAllImpressions,
} from "@/lib/actions/client/firebase-actions"

import { ImpressionChart } from "@/components/impressions-chart"
import { AdEvent } from "@/lib/types/interaction.type"
import { AdEventsBarChart } from "@/components/ad-events-bar-chart"

export default function PublisherDashboard() {
  const { user, setWebsites } = useUser()

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

  async function fetchWebsites(): Promise<Website[]> {
    if (!user || !user.firebaseId) return []

    try {
      const response = await fetch(`/api/website?uid=${user.firebaseId}`)
      if (!response.ok) throw new Error("Failed to fetch websites")
      const userWebsites: Website[] = await response.json()
      setWebsites(userWebsites)
      return userWebsites
    } catch (error) {
      console.error("Failed to load websites:", error)
      return []
    }
  }

  const { data: websites, isLoading } = useQuery<Website[], Error>({
    queryKey: ["websites", user?.address],
    queryFn: () => fetchWebsites(),
  })

  if (isLoading || !user) {
    return (
      <div className="h-[100vh] flex flex-col justify-center items-center">
        <LoaderSmall />
      </div>
    )
  }

  if (!websites) {
    return (
      <div className="h-[100vh] flex flex-col justify-center items-center">
        No website added yet.
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-[100vh] flex flex-col">
      <div className="flex p-8 items-center justify-center">
        {loadingEvents ? (
          <LoaderSmall />
        ) : (
          <div className="flex gap-8">
            <ImpressionChart clicks={clicks} impressions={impressions} />
            <AdEventsBarChart clicks={clicks} impressions={impressions} />
          </div>
        )}
      </div>
      <WebsiteDataTable data={websites} columns={columns} />
    </div>
  )
}
