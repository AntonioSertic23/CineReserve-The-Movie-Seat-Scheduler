import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { FIREBASE_CONFIG } from "./config.js";

// Initialize Firebase
initializeApp(FIREBASE_CONFIG);

const auth = getAuth();

// Check authentication status
onAuthStateChanged(auth, async (user) => {
  try {
    if (user) {
      // If user is signed in, redirect to home page
      if (window.location.pathname.endsWith("login.html")) {
        window.location.href = "/";
      }
      console.log("User is signed in");
      const uid = user.uid;
      console.log(uid);
    } else {
      // If user is not signed in, redirect to login page
      if (!window.location.pathname.endsWith("login.html")) {
        window.location.href = "/login.html";
      }
      console.log("User is signed out");
    }
  } catch (error) {
    console.error("Error checking authentication status:", error);
  }
});

// Function for logging in
async function logIn(email, password) {
  try {
    console.log(email, password);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User successfully logged in:", user);
  } catch (error) {
    console.error("Error logging in:", error.code, error.message);
  }
}

// Function for signing up
async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Signed up", user);
  } catch (error) {
    console.error("Error signing up:", error.code, error.message);
  }
}

// Function for logging out
async function logOut() {
  try {
    await signOut(auth);
    console.log("Sign-out successful.");
  } catch (error) {
    console.error("An error occurred during sign-out:", error);
  }
}

export { logIn, signUp, logOut };
