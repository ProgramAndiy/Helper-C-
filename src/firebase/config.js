import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJ771yrr30PU-rbDyeebccHAS6rlsBet0",
  authDomain: "helper-c.firebaseapp.com",
  databaseURL: "https://helper-c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "helper-c",
  storageBucket: "helper-c.firebasestorage.app",
  messagingSenderId: "1093430851235",
  appId: "1:1093430851235:web:bedd703ea08466a8e8f116",
  measurementId: "G-3X4JM7FQV6"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence to prevent hanging when offline or blocked
enableIndexedDbPersistence(db).catch((err) => {
  console.warn("Offline persistence not enabled:", err);
});

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
