export const mapFirebaseUser = (user, firestoreData = {}) => {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    
    phone: firestoreData.phone || "",
    phoneVerified: firestoreData.phoneVerified || false,
  };
};
