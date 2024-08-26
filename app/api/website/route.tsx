import { getWebsitesByUser, getWebsiteById, addWebsiteToUser } from "@/lib/actions/server/firebase-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { uid, ...websiteData } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const result = await addWebsiteToUser(uid, websiteData);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to add website" }, { status: 500 });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const websiteId = searchParams.get("id");

    let response;

    if (websiteId) {

      const website = await getWebsiteById(uid!, websiteId);
      if (!website) {
        return NextResponse.json({ error: "Website not found" }, { status: 404 });
      }
      response = website;
    } else if (uid) {

      const websites = await getWebsitesByUser(uid);
      response = websites;
    } else {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to fetch websites" }, { status: 500 });
  }
}

