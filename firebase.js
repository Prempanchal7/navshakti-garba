// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCAsIZyZpAQrfuMXz7D6Rz_GGLy0f1zZJk",
  authDomain: "navshakti-garba.firebaseapp.com",
  projectId: "navshakti-garba",
  storageBucket: "navshakti-garba.firebasestorage.app",
  messagingSenderId: "926833774117",
  appId: "1:926833774117:web:53b7473af141a780cdf9cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };