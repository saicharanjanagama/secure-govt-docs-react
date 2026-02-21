// src/utils/logger.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const logAction = async (uid, action, meta = "") => {
  try {
    await addDoc(collection(db, "logs"), {
      uid,
      action,
      meta,
      timestamp: serverTimestamp(),
    });
  } catch {
    // silently fail – logging should never break UX
  }
};
