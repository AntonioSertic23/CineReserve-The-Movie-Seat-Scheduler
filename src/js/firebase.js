import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { FIREBASE_CONFIG, ADMIN_ID, TIMEOUT_SEC } from "./config.js";

// Initialize Firebase
initializeApp(FIREBASE_CONFIG);

const auth = getAuth();

onAuthStateChanged(auth, async (user) => {
  try {
    if (user) {
      // If user is signed in, redirect to home page
      if (window.location.pathname.endsWith("login.html")) {
        window.location.href = "/";
      }
      console.log("User is signed in");
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

async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Signed up", user);
  } catch (error) {
    console.error("Error signing up:", error.code, error.message);
  }
}

async function logOut() {
  try {
    await signOut(auth);
    console.log("Sign-out successful.");
  } catch (error) {
    console.error("An error occurred during sign-out:", error);
  }
}

const timeout = (seconds) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${seconds} second(s).`));
    }, seconds * 1000);
  });
};

const getUserIDPromise = () => {
  return new Promise((resolve) => {
    if (auth.currentUser !== null) {
      resolve(auth.currentUser.uid);
    } else {
      const interval = setInterval(() => {
        if (auth.currentUser !== null) {
          clearInterval(interval);
          resolve(auth.currentUser.uid);
        }
      }, 500);
    }
  });
};

async function getLoggedInUserType() {
  try {
    const userId = await Promise.race([getUserIDPromise(), timeout(TIMEOUT_SEC)]);
    return userId === ADMIN_ID ? "admin" : "user";
  } catch (error) {
    // Handle timeout error or any other errors that might occur
    console.error(error);
    return "unknown"; // Return "unknown" in case of error
  }
}

export { logIn, signUp, logOut, getLoggedInUserType };
