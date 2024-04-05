import { logOut, getLoggedInUser } from "../firebase.js";
import * as userModel from "../models/userModel.js";
import * as theaterModel from "../models/theaterModel.js";
import theaterView from "../views/theaterView.js";

const user = await getLoggedInUser();

// 1) Loading theaters & users
await theaterModel.loadTheater();
await userModel.loadUser(user);

// 2) Rendering theater
theaterView.render(userModel.state, theaterModel.state);

document.getElementById("logoutButton").addEventListener("click", () => {
  logOut();
});
