import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import firebaseConfig from './firebaseConfig';

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