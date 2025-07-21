import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// REMPLACEZ CES VALEURS PAR VOTRE VRAIE CONFIGURATION FIREBASE
// Obtenez ces valeurs dans: Console Firebase > Paramètres du projet > Configuration
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY_ICI",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore avec configuration optimisée
export const db = getFirestore(app);

// Initialiser les autres services
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;