// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Export the initialized services
export { db, storage };



/*   apiKey: "AIzaSyDW9Lw1JR-re__lDv9e9jb-46UtqxC0DOU",
      authDomain: "free-radio-25fba.firebaseapp.com",
      databaseURL: "https://free-radio-25fba-default-rtdb.firebaseio.com",
      projectId: "free-radio-25fba",
      storageBucket: "free-radio-25fba.appspot.com",
      messagingSenderId: "638413981348",
      appId: "1:638413981348:web:2761e7d3bc9fbc4f7fc831",
      measurementId: "G-MDC2FBKL91"
      */