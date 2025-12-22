// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getEvn } from "./getEnv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: getEvn("VITE_FIREBASE_API"),
  authDomain: "blog-site-3ddf7.firebaseapp.com",
  projectId: "blog-site-3ddf7",
  storageBucket: "blog-site-3ddf7.firebasestorage.app",
  messagingSenderId: "275441714848",
  appId: "1:275441714848:web:049987a7fc1f2ebc4f6bc5",
  measurementId: "G-5KM3CDTV5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}