import Model from "./model.js";
import View from "./view.js";
import { logOut } from "./firebase.js";

class Controller {}

const app = new Controller(new Model(), new View());

document.getElementById("logoutButton").addEventListener("click", () => {
  logOut();
});
