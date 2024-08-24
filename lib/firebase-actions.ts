import { adminDb } from "@/firebase-admin"
import { User } from "./types/user.type"

const USER_COLLECTION = "users"

export const createUser = async (user: User): Promise<void> => {
  try {
    await adminDb.collection(USER_COLLECTION).add({ ...user, registered: true })
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
  return user as User
}
