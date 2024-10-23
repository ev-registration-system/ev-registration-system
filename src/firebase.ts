// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore
} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1s5WEQTHrreeK5vY8l9yQvcDEWC7l39s",
  authDomain: "ev-registration-system.firebaseapp.com",
  projectId: "ev-registration-system",
  storageBucket: "ev-registration-system.appspot.com",
  messagingSenderId: "887867872104",
  appId: "1:887867872104:web:2e627c6be360995a7fbcdd",
  measurementId: "G-0WG28YBJGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// setup database
export const db = getFirestore();