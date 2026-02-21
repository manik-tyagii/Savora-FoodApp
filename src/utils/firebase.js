// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbDy_IFGvsWEBxNVIJiB44ECM0PmGbiMk",
  authDomain: "swiggyauth-7d111.firebaseapp.com",
  projectId: "swiggyauth-7d111",
  storageBucket: "swiggyauth-7d111.firebasestorage.app",
  messagingSenderId: "305217794785",
  appId: "1:305217794785:web:343084132e36d9adb0bda0",
  measurementId: "G-MPQN691EFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Helper: subscribe to auth state changes
function onAuthChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

// Helper: sign out current user
function signOutUser() {
  return firebaseSignOut(auth);
}

export { auth, onAuthChanged, signOutUser };