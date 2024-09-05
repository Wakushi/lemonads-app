import { User } from "@/lib/types/user.type"
import { fileToBuffer } from "@/lib/utils"
import { pinFile } from "./pinata-actions"
import { PINATA_GATEWAY_BASE_URL } from "@/lib/constants"
import { AdContent } from "@/lib/types/ad-content.type"
import { AdEvent } from "@/lib/types/interaction.type"
import { Metrics } from "@/lib/types/website.type"

interface CreateAdContentArgs {
  user: User
  file: File
  title: string
  description: string
  linkUrl: string
}

export async function getAllImpressions(): Promise<AdEvent[]> {
  const reponse = await fetch("/api/ad/impressions")
  const { impressions } = await reponse.json()
  return impressions || []
}

export async function getAllClicks(): Promise<AdEvent[]> {
  const reponse = await fetch("/api/ad/clicks")
  const { clicks } = await reponse.json()
  return clicks || []
}

export async function createAdContent({
  user,
  file,
  title,
  description,
  linkUrl,
}: CreateAdContentArgs): Promise<AdContent | null> {
  if (!user) {
    console.error("User missing")
    return null
  }

  const content = {
    title,
    description,
    linkUrl,
    imageUrl: "",
  }

  if (!file) {
    console.error("No file selected")
    return null
  }

  const fileBuffer = await fileToBuffer(file)
  const blob = new Blob([fileBuffer], { type: file.type })
  const formData = new FormData()
  formData.append("file", blob, `${content.title}`)

  const hash = await pinFile(formData)

  if (!hash) return null

  content.imageUrl = `${PINATA_GATEWAY_BASE_URL}/${hash}`

  const response = await fetch("/api/ad/content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid: user.firebaseId,
      adContent: content,
    }),
  })

  const { adContent } = await response.json()
  return adContent
}

export async function getAdContents(
  userFirebaseId: string
): Promise<AdContent[]> {
  const response = await fetch(`/api/ad/content?uid=${userFirebaseId}`, {
    method: "GET",
  })

  if (!response.ok) {
    console.error("Failed to fetch ad contents")
    return []
  }

  const adContents = await response.json()
  return adContents
}

export async function getWebsiteAnalytics(
  propertyId: string
): Promise<Metrics> {
  const response = await fetch(`/api/analytics?propertyId=${propertyId}`)
  const { metrics } = await response.json()
  return metrics
}

export async function deleteAdContent(
  uid: string,
  firebaseId: string
): Promise<void> {
  await fetch("/api/ad/content", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid,
      firebaseId,
    }),
  })
}
