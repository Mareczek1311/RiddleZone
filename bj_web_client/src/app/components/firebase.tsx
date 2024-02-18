// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import * as firebase from "firebase/app";
// Required for side-effects
import "firebase/firestore";

//dostep do bazy danych
import { collection, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

import { Auth, GoogleAuthProvider, signInWithRedirect, getAuth, onAuthStateChanged, User } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBp16sRTP-k3NHPMm5cgWU4wH0q9WspAfc",
  authDomain: "bjweb-68905.firebaseapp.com",
  projectId: "bjweb-68905",
  storageBucket: "bjweb-68905.appspot.com",
  messagingSenderId: "369080115800",
  appId: "1:369080115800:web:eea5f9c76eda38fface02d",
  measurementId: "G-9J6E460K0G",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

/*
const db = getFirestore(app);

export async function addToDB() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
*/

export const auth = getAuth(app);

export async function signInWithGoogle() {
  return await signInWithRedirect(auth, new GoogleAuthProvider())
}

export function signOutUser() {
  console.log(auth.currentUser)
  return auth.signOut()
}

export function isUserLoggedIn(){
  const isLoggedIn = auth.currentUser !== null; // Jeśli currentUser istnieje, isLoggedIn = true
  console.log(isLoggedIn);
  return isLoggedIn;
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
