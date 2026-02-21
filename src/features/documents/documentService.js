import {
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage, db } from "../../utils/firebase";

/* ---------- HELPERS ---------- */

// 🔐 Sanitize filename (prevents emoji / space / URL issues)
const sanitizeFileName = name =>
  name.replace(/[^\w.-]/g, "_");

/* ---------- UPLOAD DOCUMENT WITH PROGRESS ---------- */
export const uploadDocumentWithProgress = (
  file,
  userId,
  onProgress,
  category
) => {
  return new Promise((resolve, reject) => {
    const safeFileName = sanitizeFileName(file.name);

    const storageRef = ref(
      storage,
      `documents/${userId}/${safeFileName}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const percent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(Math.round(percent));
      },
      error => reject(error),
      async () => {
        try {
          const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);

          const docRef = await addDoc(collection(db, "documents"), {
            ownerId: userId,
            fileName: safeFileName,      // storage-safe
            originalName: file.name,     // UI display
            fileType: file.type,
            category,
            fileUrl,
            storagePath: `documents/${userId}/${safeFileName}`,
            sharedWith: [],
            createdAt: serverTimestamp(),
          });

          resolve(docRef);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

/* ---------- REAL-TIME USER DOCUMENTS (OWNER) ---------- */
export const listenUserDocuments = (userId, callback) => {
  const q = query(
    collection(db, "documents"),
    where("ownerId", "==", userId)
  );

  return onSnapshot(q, snapshot => {
    const docs = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
    callback(docs);
  });
};

/* ---------- DELETE DOCUMENT (OWNER ONLY) ---------- */
export const removeDocument = async (docId, storagePath) => {
  // 1️⃣ Delete file from Storage
  await deleteObject(ref(storage, storagePath));

  // 2️⃣ Delete Firestore record
  await deleteDoc(doc(db, "documents", docId));
};

/* ---------- SHARE DOCUMENT (OWNER ONLY) ---------- */
export const shareDocument = async (docId, sharedUserId) => {
  await updateDoc(doc(db, "documents", docId), {
    sharedWith: arrayUnion(sharedUserId),
  });
};

/* ---------- REAL-TIME SHARED DOCUMENTS (VIEW ONLY) ---------- */
export const listenSharedDocuments = (userId, callback) => {
  const q = query(
    collection(db, "documents"),
    where("sharedWith", "array-contains", userId)
  );

  return onSnapshot(q, snapshot => {
    const docs = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
    callback(docs);
  });
};
