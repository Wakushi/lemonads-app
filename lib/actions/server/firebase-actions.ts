import { adminDb } from "@/firebase-admin"
import { User } from "@/lib/types/user.type"
import { adminAuth } from "@/firebase-admin";

const USER_COLLECTION = "users"

export const createUser = async (user: User): Promise<User | null> => {
  try {
    const userRecord = await adminAuth.createUser({
      email: user.email,
      displayName: user.name,
    });

    const newUser = {
      ...user,
      firebaseId: userRecord.uid,
      registered: true,
    };

    await adminDb.collection(USER_COLLECTION).doc(userRecord.uid).set(newUser);
    return newUser;
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Failed to add user");
  }
};

export const getUserByAddress = async (
  address: string
): Promise<User | null> => {
  const userRef = adminDb
    .collection(USER_COLLECTION)
    .where("address", "==", address);
  const snapshot = await userRef.get();

  if (snapshot.empty) {
    return null;
  }

  const user = snapshot.docs[0].data();
  return { ...user, firebaseId: snapshot.docs[0].id } as User;
};

export const addWebsiteToUser = async (firebaseId: string, websiteData: any) => {
  try {
    const userCollectionRef = adminDb
      .collection('users')
      .doc(firebaseId)
      .collection('websites');
    await userCollectionRef.add(websiteData);
    console.log("Website added successfully");
  } catch (error) {
    console.error("Error adding website:", error);
    throw new Error("Failed to add website");
  }
};