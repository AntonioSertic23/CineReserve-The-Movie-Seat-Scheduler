import * as theaterModel from "../models/theaterModel.js";
import * as userModel from "../models/userModel.js";
import { logOut, getLoggedInUser } from "../firebase.js";
import theaterView from "../views/theaterView.js";

const user = await getLoggedInUser();

if (user.type === "admin") {
  // 1) Loading theaters & users
  await theaterModel.loadTheater();
  await userModel.loadUser(user);

  console.log(theaterModel.state);
  console.log(userModel.state);

  // 2) Rendering theater
  theaterView.render(userModel.state, theaterModel.state);
} else {
  theaterView.render(theaterModel.state);
}

document.getElementById("logoutButton").addEventListener("click", () => {
  logOut();
});
