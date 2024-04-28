import { logIn, signUp } from "../firebase.js";

/**
 * Attaches event listener to the login button for handling login attempts.
 */
document.getElementById("loginButton").addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await logIn(email, password);
});

/**
 * Attaches event listener to the signup button for handling signup attempts.
 */
document.getElementById("signupButton").addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await signUp(email, password);
});
