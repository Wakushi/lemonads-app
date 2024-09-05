import { fileToBuffer } from "@/lib/utils"

export async function moderateImage(file: File): Promise<any> {
  const fileBuffer = await fileToBuffer(file)
  const blob = new Blob([fileBuffer], { type: file.type })

  const formData = new FormData()
  formData.append("file", blob, file.name)

  const response = await fetch("/api/moderation", {
    method: "POST",
    body: formData,
  })

  const { foundForbiddenLabels } = await response.json()
  return foundForbiddenLabels
}
