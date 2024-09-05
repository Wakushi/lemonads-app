"use client"

import { useState } from "react"
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
import { useQuery } from "@tanstack/react-query"
import { zeroAddress } from "viem"

export default function MarketplacePage() {
  const { user } = useUser()

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [language, setLanguage] = useState("all")
  const [geoReach, setGeoReach] = useState("all")
  const [sortOption, setSortOption] = useState("bid")
  const [hideRented, setHideRented] = useState<boolean>(false)

  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [availableGeoReaches, setAvailableGeoReaches] = useState<string[]>([])

  const { data: adParcels, isLoading } = useQuery<AdParcel[], Error>({
    queryKey: ["allAdParcels", user?.firebaseId],
    queryFn: () => fetchParcels(),
  })

  const { data: adContents } = useQuery<AdContent[], Error>({
    queryKey: ["adContents", user?.firebaseId],
    queryFn: () => fetchAdContent(),
  })

  async function fetchParcels(): Promise<AdParcel[]> {
    const allAdParcels = await getAllParcels(true)

    const categories = new Set<string>()
    const languages = new Set<string>()
    const geoReaches = new Set<string>()

    allAdParcels.forEach((parcel) => {
      if (parcel.website?.category) categories.add(parcel.website.category)
      if (parcel.website?.language) languages.add(parcel.website.language)
      if (parcel.website?.geoReach) geoReaches.add(parcel.website.geoReach)
    })

    setAvailableCategories(Array.from(categories))
    setAvailableLanguages(Array.from(languages))
    setAvailableGeoReaches(Array.from(geoReaches))

    return allAdParcels
  }

  async function fetchAdContent(): Promise<AdContent[]> {
    if (!user?.firebaseId) return []
    const adContents = await getAdContents(user?.firebaseId)
    return adContents
  }

  function filteredParcels(): AdParcel[] {
    if (!adParcels) return []

    return adParcels
      .filter((parcel) => {
        const website = parcel.website

        const isNotRented = parcel.renter === zeroAddress

        return (
          isNotRented &&
          (!search ||
            website?.name.toLowerCase().includes(search.toLowerCase()) ||
            website?.url.toLowerCase().includes(search.toLowerCase())) &&
          (category === "all" || website?.category === category) &&
          (language === "all" || website?.language === language) &&
          (geoReach === "all" || website?.geoReach === geoReach) &&
          (!hideRented || parcel.renter !== user?.address)
        )
      })
      .sort((a, b) => {
        if (sortOption === "bid") return b.bid - a.bid
        if (sortOption === "minBid") return b.minBid - a.minBid
        return 0
      })
  }

  if (!user) return

  if (isLoading) {
    return (
      <div className="pt-20 min-h-[100vh] flex items-center justify-center">
        <LoaderSmall />
      </div>
    )
  }

  if (!adParcels || !adParcels.length) {
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

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hideRented"
            checked={hideRented}
            onChange={() => setHideRented(!hideRented)}
            className="mr-2"
          />
          <label htmlFor="hideRented" className="text-sm">
            Hide ad parcels rented by me
          </label>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setSearch("")
            setCategory("all")
            setLanguage("all")
            setGeoReach("all")
            setSortOption("bid")
            setHideRented(false)
          }}
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>

      <div className="ml-[25%] w-[75%] p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParcels().map((parcel) => (
            <AdParcelCard
              key={parcel.id}
              parcel={parcel}
              user={user}
              adCampaigns={adContents || []}
            />
          ))}
        </div>

        {filteredParcels().length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No ad parcels match your criteria.
          </div>
        )}
      </div>
    </div>
  )
}
