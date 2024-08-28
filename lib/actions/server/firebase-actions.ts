import { admin, adminDb } from "@/firebase-admin"
import { AdContent } from "@/lib/types/ad-content.type"
import { AdEvent } from "@/lib/types/interaction.type"
import { User } from "@/lib/types/user.type"
import { Website } from "@/lib/types/website.type"

const USER_COLLECTION = "users"
const WEBSITE_COLLECTION = "websites"
const AD_CONTENT_COLLECTION = "adContents"
const AD_CLICK = "ad-clicks"
const AD_IMPRESSION = "ad-impressions"

export const createUser = async (user: User): Promise<User | null> => {
  try {
    const newUser = { ...user, registered: true }
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

    websitesSnapshot.docs.forEach((doc) => console.log(doc.id))

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
