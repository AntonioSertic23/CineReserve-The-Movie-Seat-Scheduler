import addTheaterModal from "./modals/addTheaterModal.js";
import deleteTheaterModal from "./modals/deleteTheaterModal.js";
import addMovieModal from "./modals/addMovieModal.js";
import changeMovieModal from "./modals/changeMovieModal.js";
import editTheaterModal from "./modals/editTheaterModal.js";
import bookSeatsModal from "./modals/bookSeatsModal.js";

class TheaterView {
  _parentElement = document.querySelector(".container");

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

  _generateMarkupTheater(userType, theaterData) {
    if (!theaterData) return "";

    const generateMarkup = userType === "admin" ? this._generateAdminMarkupTheater : this._generateUserMarkupTheater;
    return (theaterData ?? []).map(generateMarkup).join("");
  }

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

  addHandlerAddTheater(handler) {
    const addTheaterButton = document.getElementById("add-theater-button");

    addTheaterButton.addEventListener("click", async () => {
      try {
        const [theaterName, theaterRows, theaterColumns] = await addTheaterModal.open();

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

  addHandlerDeleteTheater(deleteTheaterButton, handler) {
    deleteTheaterButton.addEventListener("click", async (event) => {
      try {
        const theaterId = await deleteTheaterModal.open(event);

        handler(theaterId);
      } catch (error) {
        alert(error);
      }
    });
  }

  addHandlerAddMovie(addMovieButton, handler) {
    addMovieButton.addEventListener("click", async (event) => {
      try {
        const [theaterId, movie] = await addMovieModal.open(event);

        handler(theaterId, movie);
      } catch (error) {
        alert(error);
      }
    });
  }

  addHandlerChangeMovie(changeMovieButton, handler) {
    changeMovieButton.addEventListener("click", async (event) => {
      try {
        const [theaterId, movie] = await changeMovieModal.open(event);

        handler(theaterId, movie);
      } catch (error) {
        alert(error);
      }
    });
  }

  addHandlerEditTheater(editTheaterButton, handler) {
    editTheaterButton.addEventListener("click", async (event) => {
      try {
        const [theaterId, theaterName, theaterRows, theaterColumns] = await editTheaterModal.open(event);

        handler(theaterId, theaterName, theaterRows, theaterColumns);
      } catch (error) {
        alert(error);
      }
    });
  }

  addHandlerBookSeats(bookSeatsButton, handler) {
    bookSeatsButton.addEventListener("click", async (event) => {
      try {
        const [theaterId, seatsList] = await bookSeatsModal.open(event);

        handler(theaterId, seatsList);
      } catch (error) {
        alert(error);
      }
    });
  }

  createNewTheater(theater) {
    const allTheaters = document.getElementById("all-theaters");
    const newTheaterMarkup = this._generateAdminMarkupTheater(theater);
    allTheaters.insertAdjacentHTML("beforeend", newTheaterMarkup);
  }
}

export default new TheaterView();
