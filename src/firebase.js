// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvMhQJgg5Ay6VleLRiEDALyl94fhCZDjU",
  authDomain: "movies-recommendation-sy-1a5bd.firebaseapp.com",
  projectId: "movies-recommendation-sy-1a5bd",
  storageBucket: "movies-recommendation-sy-1a5bd.firebasestorage.app",
  messagingSenderId: "905833983110",
  appId: "1:905833983110:web:107f072919d5a4847bf507",
  measurementId: "G-YCC1LWCJ33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export default app; 