"use client"
import { WebsiteDataTable } from "@/components/website-data-table/website-data-table"
import { columns } from "@/components/website-data-table/website-data-table-column"
import { Website } from "@/lib/types/website.type"
import { useUser } from "@/service/user.service"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import { useQuery } from "@tanstack/react-query"

export default function PublisherDashboard() {
  const { user, setWebsites } = useUser()

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
    <div className="pt-20">
      <WebsiteDataTable data={websites} columns={columns} />
    </div>
  )
}
