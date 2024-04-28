import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, child, get, set, remove, update } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { FIREBASE_CONFIG, ADMIN_ID, TIMEOUT_SEC } from "./config.js";
import errorModal from "./views/modals/errorModal.js";
import { renderSpinner } from "./helpers.js";

// Initializes the Firebase application with the provided configuration.
initializeApp(FIREBASE_CONFIG);

// Reference to the root of the Firebase database.
const dbRef = ref(getDatabase());

// Authentication instance.
const AUTH = getAuth();

/**
 * Checks the authentication status and redirects the user if necessary.
 */
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
 * Logs in a user with email and password.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 */
export const logIn = async (email, password) => {
  const spinnerContainer = document.getElementById("spinner-container");
  const margin = "20px auto -20px auto";
  renderSpinner(spinnerContainer, margin);

  try {
    await signInWithEmailAndPassword(AUTH, email, password);
  } catch (error) {
    spinnerContainer.innerHTML = "";
    await errorModal.open("Invalid login credentials. Please double-check your email and password and try again.");
  }
};

/**
 * Signs up a new user with email and password.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 */
export const signUp = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(AUTH, email, password);
  } catch (error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        await errorModal.open("The email address is already in use by another account. Please use a different email address.");
        break;
      case "auth/invalid-email":
        await errorModal.open("Invalid email address. Please enter a valid email address.");
        break;
      case "auth/weak-password":
        await errorModal.open("The password is too weak. Please choose a stronger password.");
        break;
      default:
        await errorModal.open("An error occurred while signing up. Please try again later.");
    }
  }
};

/**
 * Logs out the current user.
 */
export const logOut = async () => {
  try {
    await signOut(AUTH);
  } catch (error) {
    await errorModal.open(`An error occurred during sign-out: ${error}`);
  }
};

/**
 * Creates a promise to reject after a specified time period.
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
 * Returns a promise resolving with the current user's ID, or waits for the user to be authenticated.
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
 * Determines the type of the logged-in user.
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

/**
 * Retrieves all theaters from the database.
 * @returns {Promise<object|null>} - A promise resolving with the theaters data or null if no data is available.
 */
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
  }
};

/**
 * Creates a new theater in the database.
 * @param {object} theaterData - Data of the theater to be created.
 */
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
  }
};

/**
 * Deletes a theater from the database.
 * @param {string} theaterId - ID of the theater to be deleted.
 */
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
  }
};

/**
 * Updates movie information for a theater in the database.
 * @param {string} theaterId - ID of the theater.
 * @param {object} movie - Movie information to be updated.
 */
export const updateMovie = async (theaterId, movie) => {
  try {
    const updates = {};
    updates["/theaters/" + theaterId + "/movie/title"] = movie.title;
    updates["/theaters/" + theaterId + "/movie/year"] = movie.year;
    updates["/theaters/" + theaterId + "/movie/image"] = movie.image;

    return update(dbRef, updates);
  } catch (error) {
    await errorModal.open(`${error}`);
  }
};

/**
 * Updates theater information in the database.
 * @param {string} theaterId - ID of the theater.
 * @param {string} theaterName - New name of the theater.
 * @param {number} theaterRows - New number of rows in the theater.
 * @param {number} theaterColumns - New number of columns in the theater.
 */
export const editTheater = async (theaterId, theaterName, theaterRows, theaterColumns) => {
  try {
    const updates = {};
    updates["/theaters/" + theaterId + "/name"] = theaterName;
    updates["/theaters/" + theaterId + "/rows"] = theaterRows;
    updates["/theaters/" + theaterId + "/columns"] = theaterColumns;

    return update(dbRef, updates);
  } catch (error) {
    await errorModal.open(`${error}`);
  }
};

/**
 * Books seats in a theater.
 * @param {string} theaterId - ID of the theater.
 * @param {array} seatsList - List of seats to be booked.
 */
export const bookSeats = async (theaterId, seatsList) => {
  try {
    const updates = {};
    updates["/theaters/" + theaterId + "/seats"] = seatsList;

    return update(dbRef, updates);
  } catch (error) {
    await errorModal.open(`${error}`);
  }
};
