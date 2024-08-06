import { getAuth } from "firebase-admin/auth";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { initializeAppCheck } from "@firebase/app-check";
const firebaseAdminConfig = JSON.parse(process.env.SERVER_FBASE_ADMIN);

// // Initialize Firebase
const app = initializeApp({
  credential: cert(firebaseAdminConfig),
  storageBucket: process.env.SERVER_FBASE_BUCKET,
});

const auth = getAuth(app);
const bucket = getStorage().bucket()

export { auth, bucket };
