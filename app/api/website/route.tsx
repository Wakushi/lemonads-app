import { getWebsitesByUser, getWebsiteById, addWebsiteToUser, updateWebsite } from "@/lib/actions/server/firebase-actions";
import { pinJSONToIPFS } from "@/lib/actions/server/pinata-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { uid, ...websiteData } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "L'ID utilisateur est requis" }, { status: 400 });
    }

    const ipfsHash = await pinJSONToIPFS(websiteData, websiteData.name);

    const websiteDataWithIpfs = {
      ...websiteData,
      ipfsHash, 
    };

    const result = await addWebsiteToUser(uid, websiteDataWithIpfs);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Erreur API :", error);
    return NextResponse.json({ error: "Échec de l'ajout du site web" }, { status: 500 });
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

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const { uid, websiteId, ...updatedWebsiteData } = await req.json();

    if (!uid || !websiteId) {
      return NextResponse.json({ error: "L'ID utilisateur et l'ID du site web sont requis" }, { status: 400 });
    }

    // Mettre à jour le site web dans Firebase
    await updateWebsite(uid, websiteId, updatedWebsiteData);

    return NextResponse.json({ message: "Website updated successfully" });
  } catch (error) {
    console.error("Erreur API :", error);
    return NextResponse.json({ error: "Échec de la mise à jour du site web" }, { status: 500 });
  }
}

