import { admin, adminDb } from "@/firebase-admin"
import { AdContent } from "@/lib/types/ad-content.type"
import { Conversion, ConversionClick } from "@/lib/types/conversion.type"
import { AdEvent } from "@/lib/types/interaction.type"
import { User } from "@/lib/types/user.type"
import { Website } from "@/lib/types/website.type"
import { Address } from "viem"
import { getAdContentByHash } from "../client/pinata-actions"

const USER_COLLECTION = "users"
const WEBSITE_COLLECTION = "websites"
const AD_CONTENT_COLLECTION = "adContents"
const AD_CLICK = "ad-clicks"
const AD_IMPRESSION = "ad-impressions"
const UUIDS = "uuids"
const CONVERSION_CLICK_ID_COLLECTION = "conversion-ids"
const CONVERSIONS = "conversions"

export const createUser = async (user: User): Promise<User | null> => {
  try {
    const newUser = {
      ...user,
      registered: true,
      address: user.address.toLowerCase() as Address,
    }
    const docRef = await adminDb.collection(USER_COLLECTION).add(newUser)
    const createdUser = { ...newUser, firebaseId: docRef.id }

    return createdUser
  } catch (error) {
    console.error("Error adding user:", error)
    throw new Error("Failed to add user")
  }
}

export const getUserByAddress = async (
  address: string
): Promise<User | null> => {
  const userRef = adminDb
    .collection(USER_COLLECTION)
    .where("address", "==", address)
  const snapshot = await userRef.get()

  if (snapshot.empty) {
    return null
  }

  const user = snapshot.docs[0].data()
  return { ...user, firebaseId: snapshot.docs[0].id } as User
}

export const addWebsiteToUser = async (
  userFirebaseId: string,
  websiteData: any
) => {
  try {
    const userCollectionRef = adminDb
      .collection(USER_COLLECTION)
      .doc(userFirebaseId)
      .collection(WEBSITE_COLLECTION)

    await userCollectionRef.add(websiteData)
  } catch (error) {
    console.error("Error adding website:", error)
    throw new Error("Failed to add website")
  }
}

export const getWebsitesByUser = async (
  firebaseId: string
): Promise<Website[]> => {
  try {
    const websitesSnapshot = await adminDb
      .collection(USER_COLLECTION)
      .doc(firebaseId)
      .collection(WEBSITE_COLLECTION)
      .get()

    const websites: Website[] = websitesSnapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as Website)
    )

    return websites
  } catch (error) {
    console.error("Error fetching websites:", error)
    throw new Error("Failed to fetch websites")
  }
}

export const addAdContentToUser = async (
  userFirebaseId: string,
  adContent: AdContent
) => {
  try {
    const userCollectionRef = adminDb
      .collection(USER_COLLECTION)
      .doc(userFirebaseId)
      .collection(AD_CONTENT_COLLECTION)
    await userCollectionRef.add(adContent)
  } catch (error) {
    console.error("Error adding ad content:", error)
    throw new Error("Failed to ad content")
  }
}

export async function registerAdClick(
  adParcelId: number,
  clickDetails: AdEvent
) {
  await adminDb.collection(AD_CLICK).add({
    adParcelId,
    ...clickDetails,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  })
}

export const getWebsiteById = async (
  userFirebaseId: string,
  websiteId: string
): Promise<Website | null> => {
  try {
    const doc = await adminDb
      .collection(USER_COLLECTION)
      .doc(userFirebaseId)
      .collection(WEBSITE_COLLECTION)
      .doc(websiteId)
      .get()

    if (!doc.exists) {
      return null
    }

    return { id: doc.id, ...doc.data() } as Website
  } catch (error) {
    console.error("Error fetching website by ID:", error)
    throw new Error("Failed to fetch website")
  }
}

export async function registerAdImpression(
  adParcelId: number,
  interactionDetails: AdEvent
) {
  await adminDb.collection(AD_IMPRESSION).add({
    adParcelId,
    ...interactionDetails,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  })
}

export async function getAllImpressions(): Promise<AdEvent[]> {
  try {
    const collectionRef = adminDb.collection(AD_IMPRESSION)
    const snapshot = await collectionRef.get()

    if (snapshot.empty) {
      console.log("No matching documents.")
      return []
    }

    const documents = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as AdEvent)
    )

    return documents
  } catch (error) {
    console.error("Error retrieving documents:", error)
    throw new Error("Failed to retrieve documents")
  }
}

/**
 * @param timestamp Epoch time in seconds (e.g: 1724829303)
 * @returns List of click events emitted since that time
 */
export async function getAllClicks(timestamp: number): Promise<AdEvent[]> {
  try {
    const startTimeRange = new Date(timestamp * 1000)
    const collectionRef = adminDb.collection(AD_CLICK)
    const snapshot = await collectionRef
      .where("timestamp", ">=", startTimeRange)
      .get()

    if (snapshot.empty) {
      console.log("No matching documents.")
      return []
    }

    const clicks = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as AdEvent)
    )

    return clicks
  } catch (error) {
    console.error("Error retrieving documents:", error)
    throw new Error("Failed to retrieve documents")
  }
}

export const getAdContentsByUser = async (
  userFirebaseId: string
): Promise<AdContent[]> => {
  try {
    const adContentsSnapshot = await adminDb
      .collection(USER_COLLECTION)
      .doc(userFirebaseId)
      .collection(AD_CONTENT_COLLECTION)
      .get()

    if (adContentsSnapshot.empty) {
      return []
    }

    const adContents: AdContent[] = adContentsSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        firebaseId: doc.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
      } as AdContent
    })

    return adContents
  } catch (error) {
    console.error("Error fetching ad contents:", error)
    throw new Error("Failed to fetch ad contents")
  }
}

export async function getLastAdClickByIp(
  ip: string,
  adParcelId: string
): Promise<AdEvent | null> {
  try {
    const collectionRef = adminDb.collection(AD_CLICK)
    const snapshot = await collectionRef
      .where("ip", "==", ip)
      .where("adParcelId", "==", adParcelId)
      .get()

    if (snapshot.empty) {
      console.log("No matching documents.")
      return null
    }

    const clicks = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as AdEvent)
    )

    return clicks.sort((a, b) => {
      if (a.timestamp?._seconds && b.timestamp?._seconds) {
        return b.timestamp?._seconds - a.timestamp?._seconds
      }
      return 1
    })[0]
  } catch (error: any) {
    console.error("Error retrieving documents:", error)
    throw new Error("Failed to retrieve click by ip")
  }
}

export async function processUuid(
  uuid: string,
  callback: () => Promise<void>
): Promise<boolean> {
  const docRef = adminDb.collection(UUIDS).doc(uuid)

  try {
    await adminDb.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef)

      if (doc.exists) {
        throw new Error("UUID has already been processed")
      }

      transaction.set(docRef, {
        processed: true,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      })

      await callback()
    })

    return true
  } catch (error: any) {
    console.error("Transaction failed: ", error.message)
    return false
  }
}

export const updateWebsite = async (
  userFirebaseId: string,
  websiteId: string,
  updatedWebsiteData: Partial<Website>
): Promise<void> => {
  try {
    const websiteRef = adminDb
      .collection(USER_COLLECTION)
      .doc(userFirebaseId)
      .collection(WEBSITE_COLLECTION)
      .doc(websiteId)

    await websiteRef.update(updatedWebsiteData)
    console.log(`Website with ID ${websiteId} has been updated.`)
  } catch (error) {
    console.error("Error updating website:", error)
    throw new Error("Failed to update website")
  }
}

export async function deleteAdContent(
  userFirebaseId: string,
  adContentFirebaseId: string
): Promise<void> {
  try {
    await adminDb
      .collection(USER_COLLECTION)
      .doc(userFirebaseId)
      .collection(AD_CONTENT_COLLECTION)
      .doc(adContentFirebaseId)
      .delete()
  } catch (error) {
    console.error("Error deleting ad content: ", error)
    throw new Error("Failed to delete ad content")
  }
}

export async function addConversionClickId(
  adParcelId: number,
  clickId: string
) {
  await adminDb.collection(CONVERSION_CLICK_ID_COLLECTION).add({
    adParcelId,
    clickId,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  })
}

export const getConversionClickById = async (
  clickId: string
): Promise<ConversionClick | null> => {
  const userRef = adminDb
    .collection(CONVERSION_CLICK_ID_COLLECTION)
    .where("clickId", "==", clickId)
  const snapshot = await userRef.get()

  if (snapshot.empty) {
    return null
  }

  return {
    ...snapshot.docs[0].data(),
    firebaseId: snapshot.docs[0].id,
  } as ConversionClick
}

interface AddConversionArgs {
  userFirebaseId: string
  adParcelId: number
  clickId: string
  contentHash: string
  websiteInfoHash: string
}

export async function addConversion({
  userFirebaseId,
  adParcelId,
  clickId,
  contentHash,
  websiteInfoHash,
}: AddConversionArgs) {
  await adminDb
    .collection(USER_COLLECTION)
    .doc(userFirebaseId)
    .collection(CONVERSIONS)
    .add({
      adParcelId,
      clickId,
      contentHash,
      websiteInfoHash,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
}

export async function deleteAdConversionClick(firebaseId: string) {
  await adminDb
    .collection(CONVERSION_CLICK_ID_COLLECTION)
    .doc(firebaseId)
    .delete()
}

export async function getUserConversions(
  userFirebaseId: string
): Promise<any[]> {
  try {
    const conversionsSnapshot = await adminDb
      .collection(USER_COLLECTION)
      .doc(userFirebaseId)
      .collection(CONVERSIONS)
      .get()

    if (conversionsSnapshot.empty) {
      return []
    }

    const conversions: Conversion[] = []

    for (let doc of conversionsSnapshot.docs) {
      const data = doc.data()
      const content = await getAdContentByHash(data.contentHash)

      conversions.push({
        firebaseId: doc.id,
        adParcelId: data.adParcelId,
        clickId: data.clickId,
        websiteInfoHash: data.websiteInfoHash,
        content: content!,
        contentHash: data.contentHash,
        timestamp: data.timestamp,
      })
    }

    return conversions
  } catch (error) {
    console.error("Error fetching ad contents:", error)
    throw new Error("Failed to fetch ad contents")
  }
}
