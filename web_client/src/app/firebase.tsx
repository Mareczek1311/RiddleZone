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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);