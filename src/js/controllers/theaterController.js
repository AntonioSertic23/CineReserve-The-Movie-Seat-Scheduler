import * as firebase from "../firebase.js";
import * as userModel from "../models/userModel.js";
import * as theaterModel from "../models/theaterModel.js";
import theaterView from "../views/theaterView.js";

/**
 * Controls the addition of a new theater.
 * @param {Object} theater - The theater object to be added.
 */
const controlAddTheater = (theater) => {
  // Update state
  const nextTheaterId = theaterModel.getNextTheaterId();
  theater.id = nextTheaterId;
  theaterModel.addTheater(theater);

  // Update firebase
  firebase.createTheater(theater);

  // Update UI
  theaterView.createNewTheater(theater);

  // Set listeners
  const allTheaters = document.getElementById("all-theaters");
  const theaterActions = allTheaters.querySelector(`[data-theater-id="${nextTheaterId}"]`);

  const deleteTheaterButton = theaterActions.querySelector(".theater-delete-theater");
  theaterView.addHandlerDeleteTheater(deleteTheaterButton, controlDeleteTheater);

  const addMovieButton = theaterActions.querySelector(".theater-add-movie");
  theaterView.addHandlerAddMovie(addMovieButton, controlAddMovie);

  const editTheaterButton = theaterActions.querySelector(".theater-edit-theater");
  theaterView.addHandlerEditTheater(editTheaterButton, controlEditTheater);
};

/**
 * Controls the deletion of a theater.
 * @param {number} theaterId - The ID of the theater to be deleted.
 */
const controlDeleteTheater = (theaterId) => {
  // Update state
  theaterModel.deleteTheater(theaterId);

  // Update firebase
  firebase.deleteTheater(theaterId);

  // Update UI
  document.getElementById("all-theaters").querySelector(`[data-theater-id="${theaterId}"]`).remove();
};

/**
 * Controls the addition of a movie to a theater.
 * @param {number} theaterId - The ID of the theater where the movie is added.
 * @param {Object} movie - The movie object to be added.
 */
const controlAddMovie = (theaterId, movie) => {
  // Update state
  theaterModel.updateMovie(theaterId, movie);

  // Update firebase
  firebase.updateMovie(theaterId, movie);

  // Update UI
  document.getElementById(`movieName-${theaterId}`).textContent = movie.title;
  document.getElementById(`movieYear-${theaterId}`).textContent = movie.year;
  document.getElementById(`movieImage-${theaterId}`).setAttribute("src", movie.image);

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

/**
 * Controls the changing of a movie in a theater.
 * @param {number} theaterId - The ID of the theater where the movie is changed.
 * @param {Object} movie - The new movie object.
 */
const controlChangeMovie = (theaterId, movie) => {
  // Update state
  theaterModel.updateMovie(theaterId, movie);

  // Update firebase
  firebase.updateMovie(theaterId, movie);

  // Update UI
  document.getElementById(`movieName-${theaterId}`).textContent = movie.title;
  document.getElementById(`movieYear-${theaterId}`).textContent = movie.year;
  document.getElementById(`movieImage-${theaterId}`).setAttribute("src", movie.image);
};

/**
 * Controls the editing of theater details.
 * @param {number} theaterId - The ID of the theater to be edited.
 * @param {string} theaterName - The new name of the theater.
 * @param {number} theaterRows - The new number of rows in the theater.
 * @param {number} theaterColumns - The new number of columns in the theater.
 */
const controlEditTheater = (theaterId, theaterName, theaterRows, theaterColumns) => {
  // Update state
  theaterModel.editTheater(theaterId, theaterName, theaterRows, theaterColumns);

  // Update firebase
  firebase.editTheater(theaterId, theaterName, theaterRows, theaterColumns);

  // Update UI
  document.getElementById(`theaterName-${theaterId}`).textContent = theaterName;
  document.getElementById(`theaterRows-${theaterId}`).textContent = theaterRows;
  document.getElementById(`theaterColumns-${theaterId}`).textContent = theaterColumns;
};

/**
 * Controls the booking of seats in a theater.
 * @param {number} theaterId - The ID of the theater where seats are booked.
 * @param {Array} seatsList - List of seats to be booked.
 */
const controlBookSeats = (theaterId, seatsList) => {
  // Update state
  theaterModel.bookSeats(theaterId, seatsList);

  // Update firebase
  firebase.bookSeats(theaterId, seatsList);
};

/**
 * Initializes the application.
 */
const init = async () => {
  const user = await firebase.getLoggedInUser();

  const theaters = await firebase.getAllTheaters();

  document.getElementById("logoutButton").addEventListener("click", () => {
    firebase.logOut();
  });

  // Loading theaters & users
  await theaterModel.loadTheater(theaters);
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
