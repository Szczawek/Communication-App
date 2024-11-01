import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "@firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "@firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID,
  measurementId: process.env.VITE_MEASUREMENT_ID,
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Lf3_l8qAAAAALpdf770bFOx9lAaBDRqHs4_kqh4"),
  isTokenAutoRefreshEnabled: true,
});
const auth = getAuth();

async function loginWithGoogle() {
  console.log(1);
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
