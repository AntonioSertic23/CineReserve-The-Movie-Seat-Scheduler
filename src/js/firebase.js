import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, child, get, set, remove, update } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { FIREBASE_CONFIG, ADMIN_ID, TIMEOUT_SEC } from "./config.js";
import errorModal from "./views/modals/errorModal.js";

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
    } else {
      // If user is not signed in, redirect to login page
      if (!window.location.pathname.endsWith("login.html")) {
        window.location.href = "/login.html";
      }
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
  } catch (error) {
    await errorModal.open(`Error logging in: ${error.code}, ${error.message}`);
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
  } catch (error) {
    await errorModal.open(`Error signing up: ${error.code}, ${error.message}`);
  }
};

// Function to log out the current user.
export const logOut = async () => {
  try {
    await signOut(AUTH);
  } catch (error) {
    await errorModal.open(`An error occurred during sign-out: ${error}`);
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
    await errorModal.open(`${error}`);
    return "unknown"; // Return "unknown" in case of error
  }
};

export const getAllTheaters = async () => {
  try {
    const snapshot = await get(child(dbRef, "theaters"));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      alert("No data available");
      return null;
    }
  } catch (error) {
    await errorModal.open(`${error}`);
    alert(error);
  }
};

export const createTheater = async (theaterData) => {
  try {
    set(child(dbRef, "theaters/" + theaterData.id), theaterData)
      .then(() => {
        alert("Data saved successfully!");
      })
      .catch((error) => {
        alert("The write failed... " + error);
      });
  } catch (error) {
    await errorModal.open(`${error}`);
    alert(error);
  }
};

export const deleteTheater = async (theaterId) => {
  try {
    remove(child(dbRef, "theaters/" + theaterId))
      .then(() => {
        alert("Data removed successfully!");
      })
      .catch((error) => {
        alert("The remove failed... " + error);
      });
  } catch (error) {
    await errorModal.open(`${error}`);
    alert(error);
  }
};

export const updateMovie = async (theaterId, movieName) => {
  try {
    const updates = {};
    updates["/theaters/" + theaterId + "/movie"] = movieName;

    return update(dbRef, updates);
  } catch (error) {
    await errorModal.open(`${error}`);
    alert(error);
  }
};

export const editTheater = async (theaterId, theaterName, theaterRows, theaterColumns) => {
  try {
    const updates = {};
    updates["/theaters/" + theaterId + "/name"] = theaterName;
    updates["/theaters/" + theaterId + "/rows"] = theaterRows;
    updates["/theaters/" + theaterId + "/columns"] = theaterColumns;

    return update(dbRef, updates);
  } catch (error) {
    await errorModal.open(`${error}`);
    alert(error);
  }
};

export const bookSeats = async (theaterId, seatsList) => {
  try {
    const updates = {};
    updates["/theaters/" + theaterId + "/seats"] = seatsList;

    return update(dbRef, updates);
  } catch (error) {
    await errorModal.open(`${error}`);
    alert(error);
  }
};
