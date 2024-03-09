import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBAXal-uUtQtiD3U6jBY9MzYouHqKQPyLE",
  authDomain: "url-shortener-48a24.firebaseapp.com",
  projectId: "url-shortener-48a24",
  storageBucket: "url-shortener-48a24.appspot.com",
  messagingSenderId: "203876816365",
  appId: "1:203876816365:web:074be092b3d848550103e4",
  measurementId: "G-C5PGGTP0HC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };