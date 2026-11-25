import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsGiw7l7gx26Ja_oBFqNj9OAorUNYSOus",
  authDomain: "divine-healer-indu.firebaseapp.com",
  projectId: "divine-healer-indu",
  storageBucket: "divine-healer-indu.firebasestorage.app",
  messagingSenderId: "391217992931",
  appId: "1:391217992931:web:43c56bf731b723dd25e1d6",
  measurementId: "G-4JN477J7H0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
