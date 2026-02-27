import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence, onIdTokenChanged } from 'firebase/auth';
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

  // Explicitly set persistence to LOCAL so that auth state is preserved
  // across PWA launches, browser restarts, and iOS standalone mode.
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('[Firebase] Could not set persistence:', err);
  });

  // Keep the session cookie in sync with the Firebase ID token.
  // Firebase auto-refreshes tokens every ~55 min; this ensures the
  // middleware cookie always holds a valid token.
  onIdTokenChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      // Use SameSite=Lax so the cookie is sent in PWA standalone mode on iOS.
      // Use a 7-day expiry so users stay logged in across visits.
      document.cookie = `session=${token}; path=/; max-age=604800; SameSite=Lax`;
    } else {
      // Clear the session cookie when the user signs out.
      document.cookie = 'session=; path=/; max-age=0; SameSite=Lax';
    }
  });
}

export { app, auth, db };