// src/utils/firebaseHelpers.js
import { auth, db } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Google login
export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// Email sign up
export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Email login
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout
export const logoutUser = async() => {
  try{
    await signOut(auth);
    console.log("user logged out");
  }catch (error){
    console.error("Error logging out",error);
  }
};

// NEW: Fetch user interests
export const getUserInterests = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().interests || [];
    } else {
      return [];
    }
  } catch (err) {
    console.error("Error fetching user interests:", err);
    return [];
  }
};


