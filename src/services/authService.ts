import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

// Sign up new user
export const signUp = async (email: string, password: string, displayName: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    const profileUrl = generateProfileUrl(displayName);
    const userData: User = {
      uid: user.uid,
      email: user.email || '',
      displayName,
      profileUrl,
      publicProfileEnabled: false,
      createdAt: Timestamp.now(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign in existing user
export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign out user
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Generate unique profile URL from display name
const generateProfileUrl = (displayName: string): string => {
  const baseUrl = displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseUrl}-${randomSuffix}`;
};
