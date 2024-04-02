import Model from "../model.js";
import View from "../views/view.js";
import { logOut, getLoggedInUserType } from "../firebase.js";
import theaterView from "../views/theaterView.js";

class Controller {}

const app = new Controller(new Model(), new View());

const userType = await getLoggedInUserType();
const state = {
  userType: userType,
};
if (userType === "admin") {
  theaterView.render(state.userType);
  theaterView.addHandlerAddTheater();
} else {
  theaterView.render(state.userType);
}

document.getElementById("logoutButton").addEventListener("click", () => {
  logOut();
});
