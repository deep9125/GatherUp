// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBq8voHQ2q05jZ8etEToO8maBckvJSQehg",
  authDomain: "gatherup-171ce.firebaseapp.com",
  projectId: "gatherup-171ce",
  storageBucket: "gatherup-171ce.firebasestorage.app",
  messagingSenderId: "1000412744262",
  appId: "1:1000412744262:web:db57119b30c80d0c251847",
  measurementId: "G-P4GDTM8368"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();