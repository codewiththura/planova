import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXBi-4jgKTFd2-dh47XzPjLcnMSsBXkQY",
  authDomain: "planova-384f5.firebaseapp.com",
  projectId: "planova-384f5",
  storageBucket: "planova-384f5.firebasestorage.app",
  messagingSenderId: "997972445632",
  appId: "1:997972445632:web:af47974caa12735be9a025",
  measurementId: "G-VZDVJ1GXBM"
};

let app: FirebaseApp | undefined;
let auth: Auth;
let db: Firestore;

if (typeof window !== "undefined") {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };