import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    const data = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(data);
    const token = credential.accessToken;
    const user = data.user;
    console.log(data, token, user);
  } catch (err) {
    console.error(`Error with login: ${err}`);
  }
}

export { loginWithGoogle };
