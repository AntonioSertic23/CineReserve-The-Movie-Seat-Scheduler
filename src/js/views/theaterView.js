import AddTheaterModal from "./modals/addTheaterModal.js";
import DeleteTheaterModal from "./modals/deleteTheaterModal.js";
import AddMovieModal from "./modals/addMovieModal.js";
import ChangeMovieModal from "./modals/changeMovieModal.js";
import EditTheaterModal from "./modals/editTheaterModal.js";
import BookSeatsModal from "./modals/bookSeatsModal.js";

/**
 * Represents the view for managing theaters.
 */
class TheaterView {
  _parentElement = document.querySelector(".container");

  /**
   * Renders the theater view.
   * @param {string} userType - The type of user (admin or user).
   * @param {Object[]} theaterData - Data for all theaters.
   */
  render(userType, theaterData) {
    this._parentElement.innerHTML = "";

    const markup = `
    <div>
      <h1 class="welcome-header">Welcome ${userType}</h1>
      <div class="all-theaters-header">
        <h2>All Theaters</h2>
        ${userType === "admin" ? '<button id="add-theater-button">Add Theater</button>' : ""}
      </div>
      <div id="all-theaters">
        ${this._generateMarkupTheater(userType, theaterData)}
      </div>
      <br><br>
    </div>`;
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Generates the markup for all theaters.
   * @param {string} userType - The type of user (admin or user).
   * @param {Object[]} theaterData - Data for all theaters.
   * @returns {string} - The HTML markup for all theaters.
   */
  _generateMarkupTheater(userType, theaterData) {
    if (!theaterData) return "";

    const generateMarkup = userType === "admin" ? this._generateAdminMarkupTheater : this._generateUserMarkupTheater;
    return (theaterData ?? []).map(generateMarkup).join("");
  }

  /**
   * Generates the markup for an admin user's view of a theater.
   * @param {Object} theater - Data for a theater.
   * @returns {string} - The HTML markup for the theater.
   */
  _generateAdminMarkupTheater(theater) {
    return `
      <div class="theater" data-theater-id="${theater.id}">
        <div class="movie-info">
          <div class="image-container">
            <img id="movieImage-${theater.id}" src="${theater.movie.image}" />
          </div>
          <p>Movie: <b id="movieName-${theater.id}">${theater.movie.title}</b></p>
          <p>Year: <b id="movieYear-${theater.id}">${theater.movie.year}</b></p>
        </div>
        <p>Name: <b id="theaterName-${theater.id}">${theater.name}</b></p>
        <p>Rows: <b id="theaterRows-${theater.id}">${theater.rows}</b></p>
        <p>Columns: <b id="theaterColumns-${theater.id}">${theater.columns}</b></p>
        ${theater.movie.title != "-" ? "<button class='theater-change-movie'>Change Movie</button>" : "<button class='theater-add-movie'>Add Movie</button>"}
        <button class="theater-edit-theater">Edit Theater</button>
        <button class="theater-delete-theater">Delete Theater</button>
      </div>
      `;
  }

  /**
   * Generates the markup for a user's view of a theater.
   * @param {Object} theater - Data for a theater.
   * @returns {string} - The HTML markup for the theater.
   */
  _generateUserMarkupTheater(theater) {
    return `
      <div class="theater" data-theater-id="${theater.id}">
        <p>Name: <b id="theaterName-${theater.id}">${theater.name}</b></p>
        <div class="movie-info">
          <div class="image-container">
            <img id="movieImage-${theater.id}" src="${theater.movie.image}" />
          </div>
          <p>Movie: <b id="movieName-${theater.id}">${theater.movie.title}</b></p>
          <p>Year: <b id="movieYear-${theater.id}">${theater.movie.year}</b></p>
        </div>
        ${theater.movie.title != "-" ? "<button class='theater-book-seats'>Book Seats</button>" : ""}
      </div>
      `;
  }

  /**
   * Adds event handler for adding a theater.
   * @param {Function} handler - The event handler function.
   */
  addHandlerAddTheater(handler) {
    const addTheaterButton = document.getElementById("add-theater-button");

    addTheaterButton.addEventListener("click", async () => {
      try {
        const [theaterName, theaterRows, theaterColumns] = await AddTheaterModal.open();

        const data = {
          name: theaterName,
          movie: {
            title: "-",
            year: "-",
            image: "-",
          },
          rows: parseInt(theaterRows),
          columns: parseInt(theaterColumns),
          seats: [],
        };

        handler(data);
      } catch (error) {
        alert(error);
      }
    });
  }

  /**
   * Adds event handler for deleting a theater.
   * @param {HTMLElement} deleteTheaterButton - The delete theater button element.
   * @param {Function} handler - The event handler function.
   */
  addHandlerDeleteTheater(deleteTheaterButton, handler) {
    deleteTheaterButton.addEventListener("click", async (event) => {
      try {
        const theaterId = await DeleteTheaterModal.open(event);

        handler(theaterId);
      } catch (error) {
        alert(error);
      }
    });
  }

  /**
   * Adds event handler for adding a movie to a theater.
   * @param {HTMLElement} addMovieButton - The add movie button element.
   * @param {Function} handler - The event handler function.
   */
  addHandlerAddMovie(addMovieButton, handler) {
    addMovieButton.addEventListener("click", async (event) => {
      try {
        const [theaterId, movie] = await AddMovieModal.open(event);

        handler(theaterId, movie);
      } catch (error) {
        alert(error);
      }
    });
  }

  /**
   * Adds event handler for changing a movie in a theater.
   * @param {HTMLElement} changeMovieButton - The change movie button element.
   * @param {Function} handler - The event handler function.
   */
  addHandlerChangeMovie(changeMovieButton, handler) {
    changeMovieButton.addEventListener("click", async (event) => {
      try {
        const [theaterId, movie] = await ChangeMovieModal.open(event);

        handler(theaterId, movie);
      } catch (error) {
        alert(error);
      }
    });
  }

  /**
   * Adds event handler for editing a theater.
   * @param {HTMLElement} editTheaterButton - The edit theater button element.
   * @param {Function} handler - The event handler function.
   */
  addHandlerEditTheater(editTheaterButton, handler) {
    editTheaterButton.addEventListener("click", async (event) => {
      try {
        const [theaterId, theaterName, theaterRows, theaterColumns] = await EditTheaterModal.open(event);

        handler(theaterId, theaterName, theaterRows, theaterColumns);
      } catch (error) {
        alert(error);
      }
    });
  }

  /**
   * Adds event handler for booking seats in a theater.
   * @param {HTMLElement} bookSeatsButton - The book seats button element.
   * @param {Function} handler - The event handler function.
   */
  addHandlerBookSeats(bookSeatsButton, handler) {
    bookSeatsButton.addEventListener("click", async (event) => {
      try {
        const [theaterId, seatsList] = await BookSeatsModal.open(event);

        handler(theaterId, seatsList);
      } catch (error) {
        alert(error);
      }
    });
  }

  /**
   * Creates a new theater and adds it to the view.
   * @param {Object} theater - Data for the new theater.
   */
  createNewTheater(theater) {
    const allTheaters = document.getElementById("all-theaters");
    const newTheaterMarkup = this._generateAdminMarkupTheater(theater);
    allTheaters.insertAdjacentHTML("beforeend", newTheaterMarkup);
  }
}

export default new TheaterView();
