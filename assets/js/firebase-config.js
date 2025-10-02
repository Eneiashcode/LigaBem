// Importações
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDSDylotUvkHzfluOCJK9cw-23fXn-EjMk",
  authDomain: "ligabem-cddd4.firebaseapp.com",
  projectId: "ligabem-cddd4",
  storageBucket: "ligabem-cddd4.firebasestorage.app",
  messagingSenderId: "723346042675",
  appId: "1:723346042675:web:59cbdbfc9dbe8288ec1846"
};

// Inicializa
const app = initializeApp(firebaseConfig);

// Serviços (⚠ declarar só uma vez cada um!)
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exports
export { app, auth, db, storage };
