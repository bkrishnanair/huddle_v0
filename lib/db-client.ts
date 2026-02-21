import { doc, getDoc, updateDoc, arrayUnion, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export const getUser = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};

export const createUser = async (userId: string, data: any) => {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { ...data, createdAt: Timestamp.now() });
};

export const saveFcmToken = async (userId: string, token: string) => {
    if (!userId || !token) return;

    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            fcmTokens: arrayUnion(token),
        });
        console.log(`FCM token saved for user: ${userId}`);
    } catch (error: any) {
        // Check if the document exists, if not create it
        if (error.code === 'not-found') {
            await setDoc(doc(db, "users", userId), { fcmTokens: [token] }, { merge: true });
            console.log(`FCM token saved for new user: ${userId}`);
        } else {
            console.error("Error saving FCM token:", error);
        }
    }
};
