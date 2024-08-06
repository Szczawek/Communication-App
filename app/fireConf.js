import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: process.env.VITE_API_KEY,
//   authDomain: process.env.VITE_AUTH_DOMAIN,
//   projectId: process.env.VITE_PROJECT_ID,
//   storageBucket: process.env.VITE_STORAGE_BUCKET,
//   messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
//   appId: process.env.VITE_APP_ID,
//   measurementId: process.env.VITE_MEASUREMENT_ID,
// };

// // // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);
async function loadFirebase() {
  try {
    const res = await fetch(`${process.env.VITE_URL}/google-login`, {
      headers: {
        token: sessionStorage.getItem("session"),
      },
      credentials: "include",
    });
    if (!res.ok) throw res.status;
    const obj = await res.json();
    console.log(obj);
  } catch (err) {
    console.log(err);
  }
}

async function loginWithGoogle() {
  await loadFirebase()
  // try {
  //   const provider = new GoogleAuthProvider();
  //   provider.setCustomParameters({
  //     prompt: "select_account",
  //   });
  //   const data = await signInWithPopup(auth, provider);
  //   const credential = GoogleAuthProvider.credentialFromResult(data);
  //   const token = credential.accessToken;
  //   const user = data.user;
  //   console.log(data, token, user);
  // } catch (err) {
  //   console.error(`Error with login: ${err}`);
  // }
}

export { loginWithGoogle };
