// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgb19ljyOQL_JL9y6VxbtsXcq-bNfS42g",
  authDomain: "pantry-app-63ace.firebaseapp.com",
  projectId: "pantry-app-63ace",
  storageBucket: "pantry-app-63ace.appspot.com",
  messagingSenderId: "92822738595",
  appId: "1:92822738595:web:085f2ce70c493f0af99116",
  measurementId: "G-JHZFP1FXME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore };
