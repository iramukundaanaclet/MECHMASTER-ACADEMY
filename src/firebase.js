import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const authConfigured = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
].every(Boolean);
const databaseConfigured = authConfigured && Boolean(firebaseConfig.databaseURL);

let app = null;
let database = null;
let auth = null;

// Keep the app usable when Firebase variables are missing or invalid in a preview build.
if (authConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = databaseConfigured ? getDatabase(app) : null;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { auth, database };

export default app;