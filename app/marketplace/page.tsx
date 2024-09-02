"use client"
import { useEffect, useState } from "react"
import LoaderSmall from "@/components/ui/loader-small/loader-small"
import { getAllParcels } from "@/lib/actions/onchain/contract-actions"
import { AdParcel } from "@/lib/types/ad-parcel.type"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AdParcelCard from "@/components/ad-parcel-card"
import { useUser } from "@/service/user.service"
import { AdContent } from "@/lib/types/ad-content.type"
import { getAdContents } from "@/lib/actions/client/firebase-actions"

export default function MarketplacePage() {
  const { user } = useUser()
  const [adParcels, setAdParcels] = useState<AdParcel[]>([])
  const [adCampaigns, setAdCampaigns] = useState<AdContent[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [language, setLanguage] = useState("all")
  const [geoReach, setGeoReach] = useState("all")
  const [sortOption, setSortOption] = useState("bid")

  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [availableGeoReaches, setAvailableGeoReaches] = useState<string[]>([])

  useEffect(() => {
    async function fetchParcels() {
      if (adParcels.length) return

      setLoading(true)
      const allAdParcels = await getAllParcels(true)

      const categories = new Set<string>()
      const languages = new Set<string>()
      const geoReaches = new Set<string>()

      allAdParcels.forEach((parcel) => {
        if (parcel.website?.category) categories.add(parcel.website.category)
        if (parcel.website?.language) languages.add(parcel.website.language)
        parcel.website?.geoReach.forEach((reach) => geoReaches.add(reach))
      })

      setAvailableCategories(Array.from(categories))
      setAvailableLanguages(Array.from(languages))
      setAvailableGeoReaches(Array.from(geoReaches))

      setAdParcels(allAdParcels)
      setLoading(false)
    }

    async function fetchAdContent() {
      if (!user?.firebaseId) return
      const adContents = await getAdContents(user?.firebaseId)
      setAdCampaigns(adContents)
    }

    fetchParcels()
    fetchAdContent()
  }, [user?.firebaseId])

  const filteredParcels = adParcels
    .filter((parcel) => {
      const website = parcel.website
      return (
        (!search ||
          website?.name.toLowerCase().includes(search.toLowerCase()) ||
          website?.url.toLowerCase().includes(search.toLowerCase())) &&
        (category === "all" || website?.category === category) &&
        (language === "all" || website?.language === language) &&
        (geoReach === "all" || website?.geoReach.includes(geoReach))
      )
    })
    .sort((a, b) => {
      if (sortOption === "bid") return b.bid - a.bid
      if (sortOption === "minBid") return b.minBid - a.minBid
      return 0
    })

  if (!user) return

  if (loading) {
    return (
      <div className="pt-20 min-h-[100vh] flex items-center justify-center">
        <LoaderSmall />
      </div>
    )
  }

  if (!adParcels.length) {
    return (
      <div className="pt-20 min-h-[100vh] flex items-center justify-center">
        <p className="text-4xl">No Ad Parcels Available</p>
      </div>
    )
  }

  return (
    <div className="pt-[6rem] min-h-[100vh] flex bg-white">
      <div className="w-1/4 fixed top-[6rem] left-0 h-[calc(100vh-6rem)] flex flex-col gap-4 bg-white shadow-lg p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <Input
          type="text"
          placeholder="Search by website name or URL"
          className="mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {availableCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {availableLanguages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={geoReach} onValueChange={setGeoReach}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Geo Reach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Geo Reaches</SelectItem>
            {availableGeoReaches.map((reach) => (
              <SelectItem key={reach} value={reach}>
                {reach}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bid">Sort by Bid</SelectItem>
            <SelectItem value="minBid">Sort by Min Bid</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setSearch("")
            setCategory("all")
            setLanguage("all")
            setGeoReach("all")
            setSortOption("bid")
          }}
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>

      {/* Ad Parcels Display */}
      <div className="ml-[25%] w-[75%] p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParcels.map((parcel) => (
            <AdParcelCard
              key={parcel.id}
              parcel={parcel}
              user={user}
              adCampaigns={adCampaigns}
            />
          ))}
        </div>

        {filteredParcels.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No ad parcels match your criteria.
          </div>
        )}
      </div>
    </div>
  )
}
