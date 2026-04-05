import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export const createProfile = async (uid, data) => {
  const ref = doc(db, 'users', uid)
  await setDoc(ref, {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export const updateProfile = async (uid, data) => {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
}