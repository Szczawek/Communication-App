// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyA-OuqlDIHvNSEdUZOYVcRh6z-LZkqHs3o",
//   authDomain: "communication-app-d664f.firebaseapp.com",
//   projectId: "communication-app-d664f",
//   storageBucket: "communication-app-d664f.appspot.com",
//   messagingSenderId: "1046917195039",
//   appId: "1:1046917195039:web:90e00768cbd550f9effc2a",
//   measurementId: "G-0STYH8ZH5W",
// };

// // // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const provider = new GoogleAuthProvider();;

// const auth = getAuth();
// async function loginWithGoogle() {
//   try {
//     const data = await signInWithPopup(auth, provider);
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;
//     const user = result.user;
//     console.log(data, token, user);
//   } catch (err) {
//     console.error(`Error with login: ${err}`);
//   }
// }

// export { loginWithGoogle };
