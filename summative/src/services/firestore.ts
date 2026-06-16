import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import type { GenrePreferences, Purchase } from '@/types';

const userDocRef = (uid: string) => doc(db, 'users', uid);

export const getUserData = async (uid: string) => {
  const snapshot = await getDoc(userDocRef(uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as {
    genrePreferences?: GenrePreferences;
    purchases?: Purchase[];
  };
};

export const saveGenrePreferences = async (
  uid: string,
  preferences: GenrePreferences
) => {
  await setDoc(
    userDocRef(uid),
    { genrePreferences: preferences },
    { merge: true }
  );
};

export const addPurchase = async (uid: string, purchase: Purchase) => {
  const data = await getUserData(uid);
  const purchases = data?.purchases ?? [];
  purchases.push(purchase);
  await setDoc(userDocRef(uid), { purchases }, { merge: true });
};

export const deleteUserData = async (uid: string) => {
  await deleteDoc(userDocRef(uid));
};
