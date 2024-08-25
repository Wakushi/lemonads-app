import { adminDb } from "@/firebase-admin"
import { User } from "@/lib/types/user.type"

const USER_COLLECTION = "users"

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
  firebaseId: string,
  websiteData: any
) => {
  try {
    const userCollectionRef = adminDb
      .collection("users")
      .doc(firebaseId)
      .collection("websites")
    await userCollectionRef.add(websiteData)
    console.log("Website added successfully")
  } catch (error) {
    console.error("Error adding website:", error)
    throw new Error("Failed to add website")
  }
}
