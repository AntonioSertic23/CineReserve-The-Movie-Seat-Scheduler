import { logIn, signUp } from "./firebase.js";

document.getElementById("loginButton").addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  logIn(email, password);
});

document.getElementById("signupButton").addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signUp(email, password);
});
