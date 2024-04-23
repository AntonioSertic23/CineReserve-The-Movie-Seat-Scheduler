import { logOut, getLoggedInUser } from "../firebase.js";
import * as userModel from "../models/userModel.js";
import * as theaterModel from "../models/theaterModel.js";
import theaterView from "../views/theaterView.js";

const controlAddTheater = function (theater) {
  // Update state
  const newTheater = theaterModel.addTheater(theater);

  // Update UI
  theaterView.createNewTheater(newTheater);

  // Set listeners
  const allTheaters = document.getElementById("all-theaters");
  const theaterActions = allTheaters.querySelector(`[data-theater-id="${newTheater.id}"]`);

  const deleteTheaterButton = theaterActions.querySelector(".theater-delete-theater");
  theaterView.addHandlerDeleteTheater(deleteTheaterButton, controlDeleteTheater);

  const addMovieButton = theaterActions.querySelector(".theater-add-movie");
  theaterView.addHandlerAddMovie(addMovieButton, controlAddMovie);

  const editTheaterButton = theaterActions.querySelector(".theater-edit-theater");
  theaterView.addHandlerEditTheater(editTheaterButton, controlEditTheater);
};

const controlDeleteTheater = function (theaterId) {
  // Update state
  theaterModel.deleteTheater(theaterId);

  // Update UI
  document.getElementById("all-theaters").querySelector(`[data-theater-id="${theaterId}"]`).remove();
};

const controlAddMovie = function (theaterId, movieName) {
  // Update state
  theaterModel.addMovie(theaterId, movieName);

  // Update UI
  document.getElementById(`movieName-${theaterId}`).textContent = movieName;

  // Change to Change Movie
  // Remove previous event listener and add a new one
  const addMovieButton = document.getElementById("all-theaters").querySelector(`[data-theater-id="${theaterId}"]`).querySelector(".theater-add-movie");
  const newAddMovieButton = addMovieButton.cloneNode(true);
  addMovieButton.parentNode.replaceChild(newAddMovieButton, addMovieButton);
  theaterView.addHandlerChangeMovie(newAddMovieButton, controlChangeMovie);

  newAddMovieButton.classList.remove("theater-add-movie");
  newAddMovieButton.classList.add("theater-change-movie");
  newAddMovieButton.textContent = "Change Movie";
};

const controlChangeMovie = function (theaterId, movieName) {
  // Update state
  theaterModel.changeMovie(theaterId, movieName);

  // Update UI
  document.getElementById(`movieName-${theaterId}`).textContent = movieName;
};

const controlEditTheater = function (theaterId, theaterName, theaterRows, theaterColumns) {
  // Update state
  theaterModel.editTheater(theaterId, theaterName, theaterRows, theaterColumns);

  // Update UI
  document.getElementById(`theaterName-${theaterId}`).textContent = theaterName;
  document.getElementById(`theaterRows-${theaterId}`).textContent = theaterRows;
  document.getElementById(`theaterColumns-${theaterId}`).textContent = theaterColumns;
};

const controlBookSeats = function (theaterId, seatsList) {
  // Update state
  theaterModel.bookSeats(theaterId, seatsList);
};

const init = async function () {
  const user = await getLoggedInUser();

  document.getElementById("logoutButton").addEventListener("click", () => {
    logOut();
  });

  // Loading theaters & users
  await theaterModel.loadTheater();
  await userModel.loadUser(user);

  // Rendering theater
  const userType = userModel.state.user.type;
  theaterView.render(userType, theaterModel.state);

  if (userType === "admin") {
    theaterView.addHandlerAddTheater(controlAddTheater);

    const deleteTheaterButtons = document.querySelectorAll(".theater-delete-theater");
    deleteTheaterButtons.forEach((deleteTheaterButton) => theaterView.addHandlerDeleteTheater(deleteTheaterButton, controlDeleteTheater));

    const addMovieButtons = document.querySelectorAll(".theater-add-movie");
    addMovieButtons.forEach((addMovieButton) => theaterView.addHandlerAddMovie(addMovieButton, controlAddMovie));

    const changeMovieButtons = document.querySelectorAll(".theater-change-movie");
    changeMovieButtons.forEach((changeMovieButton) => theaterView.addHandlerChangeMovie(changeMovieButton, controlChangeMovie));

    const editTheaterButtons = document.querySelectorAll(".theater-edit-theater");
    editTheaterButtons.forEach((editTheaterButton) => theaterView.addHandlerEditTheater(editTheaterButton, controlEditTheater));
  } else {
    const bookSeatsButtons = document.querySelectorAll(".theater-book-seats");
    bookSeatsButtons.forEach((bookSeatsButton) => theaterView.addHandlerBookSeats(bookSeatsButton, controlBookSeats));
  }
};
init();
