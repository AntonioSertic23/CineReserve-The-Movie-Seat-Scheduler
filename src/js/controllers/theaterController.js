import { logOut, getLoggedInUser } from "../firebase.js";
import * as userModel from "../models/userModel.js";
import * as theaterModel from "../models/theaterModel.js";
import theaterView from "../views/theaterView.js";

const controlAddTheater = function (theater) {
  // Update state
  const newTheater = theaterModel.addTheater(theater);

  // Update UI
  theaterView.createNewTheater(newTheater);

  /* 
  const theaterActions = allTheaters.querySelector(`[data-theater-id="${newTheater.id}"]`);
  
  const addMovieButton = theaterActions.querySelector(".theater-add-movie");
  theaterView.addHandlerAddMovie(addMovieButton);
  
  const editTheaterButton = theaterActions.querySelector(".theater-edit-theater");
  theaterView.addHandlerEditTheater(editTheaterButton);
  
  const deleteTheaterButton = theaterActions.querySelector(".theater-delete-theater");
  theaterView.addHandlerDeleteTheater(deleteTheaterButton);
  */
};

const controlDeleteTheater = function (theaterId) {
  // Update state
  theaterModel.deleteTheater(theaterId);

  // Update UI
  document.getElementById("all-theaters").querySelector(`[data-theater-id="${theaterId}"]`).remove();
};

const init = async function () {
  const user = await getLoggedInUser();

  document.getElementById("logoutButton").addEventListener("click", () => {
    console.log(theaterModel.state);
    // logOut();
  });

  // Loading theaters & users
  await theaterModel.loadTheater();
  await userModel.loadUser(user);

  // Rendering theater
  const userType = userModel.state.user.type;
  theaterView.render(userType, theaterModel.state);

  if (userType === "admin") {
    theaterView.addHandlerAddTheater(controlAddTheater);

    const theaterDeleteTheater = document.querySelectorAll(".theater-delete-theater");
    theaterDeleteTheater.forEach((theater) => theaterView.addHandlerDeleteTheater(theater, controlDeleteTheater));

    /* theaterView.theaterAddMovie();
    theaterView.theaterChangeMovie();
    theaterView.theaterEditTheater(); */
  } else {
    /* theaterView.theaterBookSeats();
    theaterView.theaterEditSeats(); */
  }
};
init();
