import { Rekognition } from "aws-sdk"
import { NextRequest, NextResponse } from "next/server"

const forbiddenLabels = [
  "Explicit Nudity",
  "Violence",
  "Visually Disturbing",
  "Rude Gestures",
  "Tobacco",
  "Gambling",
  "Hate Symbols",
  "Weapons",
  "Drugs & Tobacco Paraphernalia & Use",
  "Drugs & Tobacco",
]

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rekognition = new Rekognition({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || "us-east-1",
  })

  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const params: Rekognition.Types.DetectModerationLabelsRequest = {
      Image: {
        Bytes: buffer,
      },
      MinConfidence: 70,
    }

    const { ModerationLabels } = await rekognition
      .detectModerationLabels(params)
      .promise()

    if (!ModerationLabels || ModerationLabels.length === 0) {
      return NextResponse.json({ foundForbiddenLabels: [] })
    }

    const labels = ModerationLabels.map((label) => label.ParentName).filter(
      Boolean
    )

    console.log("Found labels:", JSON.stringify(labels))

    const foundForbiddenLabels = labels.filter(
      (label) => label && forbiddenLabels.includes(label)
    )
    console.log("Found forbidden labels:", JSON.stringify(foundForbiddenLabels))

    return NextResponse.json({ foundForbiddenLabels })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
