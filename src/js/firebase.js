import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, child, get, set, remove, update } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { FIREBASE_CONFIG, ADMIN_ID, TIMEOUT_SEC } from "./config.js";

// Initialize Firebase with the provided configuration.
initializeApp(FIREBASE_CONFIG);

const dbRef = ref(getDatabase());

// Get the authentication instance.
const AUTH = getAuth();

// Check the authentication status and handle redirection if necessary.
onAuthStateChanged(AUTH, async (user) => {
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

/**
 * Function to log in a user with email and password.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 */
export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(AUTH, email, password);
    const user = userCredential.user;
    console.log("User successfully logged in:", user);
  } catch (error) {
    console.error("Error logging in:", error.code, error.message);
  }
};

/**
 * Function to sign up a new user with email and password.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 */
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(AUTH, email, password);
    const user = userCredential.user;
    console.log("Signed up", user);
  } catch (error) {
    console.error("Error signing up:", error.code, error.message);
  }
};

// Function to log out the current user.
export const logOut = async () => {
  try {
    await signOut(AUTH);
    console.log("Sign-out successful.");
  } catch (error) {
    console.error("An error occurred during sign-out:", error);
  }
};

/**
 * A function that creates a promise to reject after a specified time period.
 * @param {number} seconds - The time in seconds before the promise rejects.
 * @returns {Promise} - A promise that rejects after the specified time.
 */
const timeout = (seconds) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${seconds} second(s).`));
    }, seconds * 1000);
  });
};

/**
 * A function that returns a promise resolving with the current user's ID, or waits for the user to be authenticated.
 * @returns {Promise} - A promise resolving with the current user's ID.
 */
const getUserIDPromise = () => {
  return new Promise((resolve) => {
    if (AUTH.currentUser !== null) {
      resolve(AUTH.currentUser);
    } else {
      const interval = setInterval(() => {
        if (AUTH.currentUser !== null) {
          clearInterval(interval);
          resolve(AUTH.currentUser);
        }
      }, 500);
    }
  });
};

/**
 * A function that determines the type of the logged-in user.
 * @returns {Promise<string>} - A promise resolving with the type of the logged-in user ("admin" or "user").
 */
export const getLoggedInUser = async () => {
  try {
    const currentUser = await Promise.race([getUserIDPromise(), timeout(TIMEOUT_SEC)]);
    return {
      email: currentUser.email,
      uid: currentUser.uid,
      type: currentUser.uid === ADMIN_ID ? "admin" : "user",
    };
  } catch (error) {
    // Handle timeout error or any other errors that might occur
    console.error(error);
    return "unknown"; // Return "unknown" in case of error
  }
};

export const getAllTheaters = async () => {
  try {
    const snapshot = await get(child(dbRef, "theaters"));
    if (snapshot.exists()) {
      console.log(snapshot.val());
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createTheater = async (theaterData) => {
  try {
    set(child(dbRef, "theaters/" + theaterData.id), theaterData)
      .then(() => {
        console.log("Data saved successfully!");
      })
      .catch((error) => {
        console.log("The write failed... " + error);
      });
  } catch (error) {
    console.error("Greška pri kreiranju teatra:", error);
    throw error;
  }
};

export const deleteTheater = async (theaterId) => {
  try {
    remove(child(dbRef, "theaters/" + theaterId))
      .then(() => {
        console.log("Data removed successfully!");
      })
      .catch((error) => {
        console.log("The remove failed... " + error);
      });
  } catch (error) {
    console.error("Greška pri brisanju teatra:", error);
    throw error;
  }
};

export const updateMovie = async (theaterId, movieName) => {
  const updates = {};
  updates["/theaters/" + theaterId + "/movie"] = movieName;

  return update(dbRef, updates);
};

export const editTheater = async (theaterId, theaterName, theaterRows, theaterColumns) => {
  const updates = {};
  updates["/theaters/" + theaterId + "/name"] = theaterName;
  updates["/theaters/" + theaterId + "/rows"] = theaterRows;
  updates["/theaters/" + theaterId + "/columns"] = theaterColumns;

  return update(dbRef, updates);
};

export const bookSeats = async (theaterId, seatsList) => {
  const updates = {};
  updates["/theaters/" + theaterId + "/seats"] = seatsList;

  return update(dbRef, updates);
};
