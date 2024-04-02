import Model from "./model.js";
import View from "./view.js";
import { logOut, getLoggedInUserType } from "./firebase.js";

class Controller {}

const app = new Controller(new Model(), new View());

const mainContainer = document.getElementById("main");

const userType = getLoggedInUserType();
if ((await userType) === "admin") {
  mainContainer.innerHTML = "<h1>Welcome Admin</h1>";
} else {
  mainContainer.innerHTML = "<h1>Welcome User</h1>";
}

document.getElementById("logoutButton").addEventListener("click", () => {
  logOut();
});
