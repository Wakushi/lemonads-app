import { useState } from "react"
import { AdParcel } from "@/lib/types/ad-parcel.type"
import { formatEther, zeroAddress } from "viem"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BiSolidCategory, BiSolidTrafficCone } from "react-icons/bi"
import { AiOutlineCheckCircle } from "react-icons/ai"
import { FaExternalLinkAlt, FaLanguage, FaGlobeAmericas } from "react-icons/fa"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Input } from "@/components/ui/input"
import { writeRentAdParcel } from "@/lib/actions/onchain/contract-actions"
import { User, UserType } from "@/lib/types/user.type"
import { AdContent } from "@/lib/types/ad-content.type"
import { pinAdContent } from "@/lib/actions/client/pinata-actions"
import TooltipWrapper from "./ui/custom-tooltip"
import { Label } from "./ui/label"
import { FcGoogle } from "react-icons/fc"
import { FiUsers, FiClock, FiBarChart, FiActivity } from "react-icons/fi"
import { FaEye } from "react-icons/fa"
import clsx from "clsx"
import { useRouter } from "next/navigation"

interface AdParcelCardProps {
  parcel: AdParcel
  user: User
  adCampaigns: AdContent[]
}

export default function AdParcelCard({
  parcel,
  user,
  adCampaigns,
}: AdParcelCardProps) {
  const router = useRouter()
  const [newBid, setNewBid] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [selectedCampaignTitle, setSelectedCampaignTitle] = useState<string>("")
  const isRented = parcel.renter && parcel.renter !== zeroAddress

  async function handleRentParcel() {
    if (!selectedCampaignTitle) return

    const adContent = adCampaigns.find(
      (campaign) => campaign.title === selectedCampaignTitle
    )

    if (!adContent) return

    setLoading(true)

    try {
      const contentHash = await pinAdContent(adContent, +parcel.id)

      await writeRentAdParcel({
        account: user.address,
        adParcelId: +parcel.id,
        newBid: +newBid,
        contentHash: contentHash,
      })

      setSuccess(true)
    } catch (error) {
      console.error("Failed to rent parcel: ", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden bg-white">
      {/* Header Section */}
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-gray-900">
              {parcel.website?.name || "Unknown Website"}
            </CardTitle>
            {isRented && (
              <TooltipWrapper message="This ad parcel is rented">
                <AiOutlineCheckCircle className="text-yellow-500 text-xl" />
              </TooltipWrapper>
            )}
          </div>
          <Link href={parcel.website?.url || "#"} target="_blank">
            <FaExternalLinkAlt className="w-5 h-5 text-brand hover:text-brand-dark transition-colors duration-200" />
          </Link>
        </div>
        <div className="text-md text-gray-800 mt-1">
          Bid:{" "}
          <span className="font-semibold">
            {formatEther(BigInt(parcel.bid))} ETH
          </span>
        </div>
        <div className="text-sm text-gray-600">
          Min Bid:{" "}
          <span className="font-medium">
            {formatEther(BigInt(parcel.minBid))} ETH
          </span>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="flex flex-col gap-3">
        <div className="flex justify-between gap-2">
          <div className="flex flex-col items-center rounded bg-gray-50 p-4 shadow flex-1">
            <TooltipWrapper message="Category">
              <BiSolidCategory className="text-slate-800 text-2xl mb-1" />
            </TooltipWrapper>
            <p className="text-slate-800 text-sm">
              {parcel.website?.category || "N/A"}
            </p>
          </div>

          <Popover>
            <PopoverTrigger
              className={clsx(
                "cursor-pointer border border-transparent transition-all duration-200 ease-in-out relative flex flex-col items-center rounded bg-gray-50 p-4 shadow flex-1",
                {
                  "hover:border-brand": parcel.website?.metrics,
                }
              )}
            >
              {" "}
              {parcel.website?.metrics && (
                <FcGoogle className="absolute top-2 right-2 text-lg" />
              )}
              <BiSolidTrafficCone className="text-slate-800 text-2xl mb-1" />
              <p className="text-slate-800 text-sm">
                {parcel.website?.trafficAverage || "N/A"}
              </p>
            </PopoverTrigger>
            <PopoverContent>
              {" "}
              {parcel.website?.metrics ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <FcGoogle className="text-lg" />
                    <span className="text-sm">Google Analytics (monthly)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <MetricDisplay
                      icon={<FiUsers />}
                      label="Active Users"
                      value={parcel.website?.metrics.activeUsers}
                    />
                    <MetricDisplay
                      icon={<FiClock />}
                      label="Avg. Session Duration"
                      value={`${parcel.website?.metrics.averageSessionDuration}s`}
                    />
                    <MetricDisplay
                      icon={<FiBarChart />}
                      label="Bounce Rate"
                      value={`${parcel.website?.metrics.bounceRate}%`}
                    />
                    <MetricDisplay
                      icon={<FiActivity />}
                      label="Engagement Rate"
                      value={`${parcel.website?.metrics.engagementRate}%`}
                    />
                    <MetricDisplay
                      icon={<FaEye />}
                      label="Page Views"
                      value={parcel.website?.metrics.screenPageViews}
                    />
                    <MetricDisplay
                      icon={<FiUsers />}
                      label="Sessions"
                      value={parcel.website?.metrics.sessions}
                    />
                    <MetricDisplay
                      icon={<FiUsers />}
                      label="Sessions/User"
                      value={parcel.website?.metrics.sessionsPerUser}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p>
                    This is the monthly average traffic estimated by the owner
                    of this ad parcel.
                  </p>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex justify-between gap-2">
          <div className="flex flex-col items-center rounded bg-gray-50 p-4 shadow flex-1">
            <TooltipWrapper message="Language">
              <FaLanguage className="text-slate-800 text-2xl mb-1" />
            </TooltipWrapper>
            <p className="text-slate-800 text-sm">
              {parcel.website?.language || "N/A"}
            </p>
          </div>
          <div className="flex flex-col items-center rounded bg-gray-50 p-4 shadow flex-1">
            <TooltipWrapper message="Geo reach">
              <FaGlobeAmericas className="text-slate-800 text-2xl mb-1" />
            </TooltipWrapper>
            <p
              className="text-slate-800 text-sm"
              title={parcel.website?.geoReach ? parcel.website.geoReach : "N/A"}
            >
              {parcel.website?.geoReach ? parcel.website.geoReach : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="flex justify-between items-center">
        {user.type === UserType.ANNOUNCER && parcel.renter !== user.address && (
          <Dialog
            onOpenChange={(open) => {
              if (!open && success) {
                router.push("/announcer?view=adParcels")
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full bg-brand hover:bg-white hover:text-brand transition-colors duration-200">
                {isRented ? "Place a Higher Bid" : "Rent Parcel"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              {success ? (
                <div className="w-full h-[300px] flex items-center justify-center text-2xl">
                  Ad parcel rented!
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>
                      {isRented ? "Place a Higher Bid" : "Rent Parcel"}
                    </DialogTitle>
                    <DialogDescription>
                      Enter a new bid amount and select a campaign.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    {!!adCampaigns.length ? (
                      <>
                        <Label>Advertising campaign</Label>
                        <Select onValueChange={setSelectedCampaignTitle}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a campaign" />
                          </SelectTrigger>
                          <SelectContent>
                            {adCampaigns.map((campaign) => (
                              <SelectItem
                                key={campaign.title}
                                value={campaign.title}
                              >
                                {campaign.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <Link
                        href="/announcer?view=adContent"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      >
                        Create my first campaign
                      </Link>
                    )}

                    <Label>Amount paid per click</Label>
                    <Input
                      id="bid"
                      type="number"
                      placeholder={formatEther(BigInt(parcel.bid))}
                      value={newBid}
                      onChange={(e) => setNewBid(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleRentParcel}
                      disabled={!selectedCampaignTitle || loading}
                    >
                      {loading ? "Processing..." : "Confirm Bid"}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  )
}

function MetricDisplay({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-lg">{icon}</div>
      <div>
        <p className="font-medium text-xs">{label}</p>
        <p className="text-sm text-gray-500">{value}</p>
      </div>
    </div>
  )
}
