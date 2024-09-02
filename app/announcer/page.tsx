"use client"
import { useEffect, useState } from "react"
import AdContentPage from "@/components/ad-content"
import AdStats from "@/components/ad-stats"
import { useSearchParams } from "next/navigation"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import AdParcelView from "@/components/ad-parcel-view"
import { useUser } from "@/service/user.service"
import clsx from "clsx"
import { ImpressionChart } from "@/components/impressions-chart"
import { AdEventsBarChart } from "@/components/ad-events-bar-chart"
import { AdEvent } from "@/lib/types/interaction.type"
import {
  getAllClicks,
  getAllImpressions,
} from "@/lib/actions/client/firebase-actions"

export default function AnnouncerDashboard() {
  const searchParams = useSearchParams()
  const { user } = useUser()

  const [activeComponent, setActiveComponent] = useState("dashboard")
  const [impressions, setImpressions] = useState<AdEvent[]>([])
  const [clicks, setClicks] = useState<AdEvent[]>([])
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    const view = searchParams.get("view")
    if (view === "adContent") {
      setActiveComponent("adContent")
    } else if (view === "stats") {
      setActiveComponent("stats")
    } else if (view === "adParcels") {
      setActiveComponent("adParcels")
    } else {
      setActiveComponent("dashboard")
    }
  }, [searchParams])

  const renderComponent = () => {
    if (!user) return

    switch (activeComponent) {
      case "adContent":
        return <AdContentPage loading={loading} setLoading={setLoading} />
      case "stats":
        return <AdStats />
      case "adParcels":
        return <AdParcelView user={user} />
      default:
        return (
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
        )
    }
  }

  return (
    <div className="flex pt-20 min-h-[100vh]">
      <nav className="w-1/5 h-screen fixed top-0 left-0 text-brand border-r flex flex-col pt-24">
        <ul className="flex flex-col gap-4">
          <li>
            <button
              onClick={() => setActiveComponent("dashboard")}
              className={clsx(
                "block text-left w-full px-8 py-2 font-bold",
                activeComponent === "dashboard"
                  ? "bg-brand text-white"
                  : "hover:bg-brand hover:text-white"
              )}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("adContent")}
              className={clsx(
                "block text-left w-full px-8 py-2",
                activeComponent === "adContent"
                  ? "bg-brand text-white"
                  : "hover:bg-brand hover:text-white"
              )}
            >
              Campaigns
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("adParcels")}
              className={clsx(
                "block text-left w-full px-8 py-2",
                activeComponent === "adParcels"
                  ? "bg-brand text-white"
                  : "hover:bg-brand hover:text-white"
              )}
            >
              Ad Parcels
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("stats")}
              className={clsx(
                "block text-left w-full px-8 py-2",
                activeComponent === "stats"
                  ? "bg-brand text-white"
                  : "hover:bg-brand hover:text-white"
              )}
            >
              Statistics
            </button>
          </li>
        </ul>
      </nav>

      <div className="ml-[20%] w-[80%] p-8">
        {loading ? <LoaderSmall /> : renderComponent()}
      </div>
    </div>
  )
}
