import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth, googleProvider, githubProvider } from '../../lib/firebase'

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

export const loginWithGithub = () => signInWithPopup(auth, githubProvider)

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const registerWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)

export const logout = () => signOut(auth)