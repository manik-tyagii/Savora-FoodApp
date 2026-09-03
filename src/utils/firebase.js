import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbDy_IFGvsWEBxNVIJiB44ECM0PmGbiMk",
  authDomain: "swiggyauth-7d111.firebaseapp.com",
  projectId: "swiggyauth-7d111",
  storageBucket: "swiggyauth-7d111.firebasestorage.app",
  messagingSenderId: "305217794785",
  appId: "1:305217794785:web:343084132e36d9adb0bda0",
  measurementId: "G-MPQN691EFR",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

function onAuthChanged(callback) {
  if (typeof callback !== "function") {
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

function signOutUser() {
  return firebaseSignOut(auth);
}

export { auth, onAuthChanged, signOutUser };
