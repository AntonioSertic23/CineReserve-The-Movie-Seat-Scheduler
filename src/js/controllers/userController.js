import { logIn, signUp } from "../firebase.js";

document.getElementById("loginButton").addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await logIn(email, password);
});

document.getElementById("signupButton").addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await signUp(email, password);
});
