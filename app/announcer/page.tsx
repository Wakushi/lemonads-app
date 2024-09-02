"use client"
import { useEffect, useState } from "react"
import AdContentPage from "@/components/ad-content"
import AdStats from "@/components/ad-stats"
import { useSearchParams } from "next/navigation"
import LoaderSmall from "@/components/ui/loader-small/loader-small"

export default function AnnouncerDashboard() {
  const searchParams = useSearchParams()

  const [activeComponent, setActiveComponent] = useState("dashboard")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const view = searchParams.get("view")
    if (view === "adContent") {
      setActiveComponent("adContent")
    }
  }, [])

  const renderComponent = () => {
    switch (activeComponent) {
      case "adContent":
        return <AdContentPage loading={loading} setLoading={setLoading} />
      case "stats":
        return <AdStats />
      default:
        return <div>Welcome to the Announcer Dashboard!</div>
    }
  }

  return (
    <div className="flex pt-20 min-h-[100vh]">
      <nav className="w-1/5 h-screen fixed top-0 left-0 text-brand border-r flex flex-col pt-24">
        <ul className="flex flex-col gap-4">
          <li>
            <button
              onClick={() => setActiveComponent("")}
              className="block text-left w-full px-8 py-2 hover:bg-brand hover:text-white font-bold"
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("adContent")}
              className="block text-left w-full px-8 py-2 hover:bg-brand hover:text-white"
            >
              Create Ad Content
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("stats")}
              className="block text-left w-full px-8 py-2 hover:bg-brand hover:text-white"
            >
              View Ads Stats
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
