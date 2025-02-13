import { db } from "./firebaseConfig";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Reference to the "users" collection
const usersCollection = collection(db, "users");

/**
 * Fetch a user's profile from Firestore
 * @param {string} userId - Firebase Authentication user ID
 * @returns {Object|null} User data or null if not found
 */
export const getUserProfile = async (userId) => {
  const userDocRef = doc(usersCollection, userId); // Reference to the user's document
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    return userSnap.data(); // Return user profile data
  } else {
    console.log("No user profile found");
    return null;
  }
};

/**
 * Create a new user profile (or overwrite existing one)
 * @param {string} userId - Firebase Authentication user ID
 * @param {Object} profileData - User profile data
 */
export const createUserProfile = async (userId, profileData) => {
  const userDocRef = doc(usersCollection, userId);
  await setDoc(userDocRef, profileData); // Creates or overwrites the profile
  console.log("User profile created/updated!");
};

/**
 * Update an existing user profile
 * @param {string} userId - Firebase Authentication user ID
 * @param {Object} updatedData - Fields to update
 */
export const updateUserProfile = async (userId, updatedData) => {
  const userDocRef = doc(usersCollection, userId);
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    await updateDoc(userDocRef, updatedData);
    console.log("User profile updated!");
  } else {
    console.error("No user profile found to update!");
  }
};
