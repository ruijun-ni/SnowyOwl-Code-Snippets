import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Your web app's Firebase configuration (get this from firebase console)
// Your web app's Firebase configuration
const firebaseConfig = { 
  apiKey: "AIzaSyAFLIKBeP5eGmwJPjd_ilgYdjupQjZih6E", 
  authDomain: "snowyvue-80f93.firebaseapp.com", 
  projectId: "snowyvue-80f93", 
  storageBucket: "snowyvue-80f93.appspot.com", 
  messagingSenderId: "1013871714372", 
  appId: "1:1013871714372:web:65d6c62bf82a57a7229c11", 
  measurementId: "G-FZ6PPJWZS4" 
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// initalize components
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();

// enable offline persistence
// reference: https://firebase.google.com/docs/firestore/manage-data/enable-offline
db.enablePersistence();