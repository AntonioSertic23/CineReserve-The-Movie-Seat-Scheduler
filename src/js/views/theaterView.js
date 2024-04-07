import { openModal } from "./modal.js";
import { MIN_ROWS_COLUMNS, MAX_ROWS_COLUMNS } from "../config.js";

class TheaterView {
  _parentElement = document.querySelector(".container");
  _userData;
  _theaterData;

  render(userData, theterData) {
    this._userData = userData.user;
    this._theaterData = theterData;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", this._generateMarkup());

    // TODO: Move this to theaterController so actions can be managed from there, as updateTheaterState can then be called from there to update the global state, rather than updating _theaterData here.
    if (this._userData.type === "admin") {
      this.addHandlerAddTheater();

      const theaterAddMovie = document.querySelectorAll(".theater-add-movie");
      theaterAddMovie.forEach((movie) => this.addHandlerAddMovie(movie));

      const theaterChangeMovie = document.querySelectorAll(".theater-change-movie");
      theaterChangeMovie.forEach((movie) => this.addHandlerChangeMovie(movie));

      const theaterEditTheater = document.querySelectorAll(".theater-edit-theater");
      theaterEditTheater.forEach((theater) => this.addHandlerEditTheater(theater));

      const theaterDeleteTheater = document.querySelectorAll(".theater-delete-theater");
      theaterDeleteTheater.forEach((theater) => this.addHandlerDeleteTheater(theater));
    } else {
      this.addHandlerEditSeats();
      this.addHandlerBookSeats();
    }
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  addHandlerAddTheater() {
    const allTheaters = document.getElementById("all-theaters");
    const addTheaterButton = document.getElementById("add-theater-button");

    addTheaterButton.addEventListener("click", async () => {
      const addTheaterModalContent = `
      <div id="add-theater-form">
        <label for="theater-rows">Rows:</label>
        <input id="theater-rows" type="number" min="${MIN_ROWS_COLUMNS}" max="${MAX_ROWS_COLUMNS}">
        <label for="theater-columns">Columns:</label>
        <input id="theater-columns" type="number" min="${MIN_ROWS_COLUMNS}" max="${MAX_ROWS_COLUMNS}">
        <div class="parent-container">
        <ul class="showcase">
          <li>
            <div class="seat"> </div>
            <p>N/A</p>
          </li>
          <li>
            <div class="seat selected"> </div>
            <p>Selected</p>
          </li>
          <li>
            <div class="seat occupied"> </div>
            <p>Occupied</p>
          </li>
        </ul>
          <div id="theater-container"></div>
        <div>
      </div>
      `;

      try {
        await openModal("Add Theater", addTheaterModalContent, true);

        const modalBody = document.getElementById("modalBody");
        const addTheaterRows = modalBody.querySelector("#theater-rows").value;
        const addTheaterColumns = modalBody.querySelector("#theater-columns").value;
        const nextTheaterId = this._theaterData.at(-1) ? this._theaterData.at(-1).id + 1 : 1;

        this._theaterData.push({ id: nextTheaterId, movie: "-", rows: addTheaterRows, columns: addTheaterColumns });

        allTheaters.insertAdjacentHTML("beforeend", this._createNewTheater(addTheaterRows, addTheaterColumns, nextTheaterId));

        const newTheater = allTheaters.querySelector(`[data-theater-id="${nextTheaterId}"]`);
        const addMovieButton = newTheater.querySelector(".theater-add-movie");
        this.addHandlerAddMovie(addMovieButton);
        const editTheaterButton = newTheater.querySelector(".theater-edit-theater");
        this.addHandlerEditTheater(editTheaterButton);
        const deleteTheaterButton = newTheater.querySelector(".theater-delete-theater");
        this.addHandlerDeleteTheater(deleteTheaterButton);
      } catch (error) {
        console.log("An error has occurred.", error);
      }
    });
  }

  addHandlerAddMovie(movie) {
    movie.addEventListener("click", async (event) => {
      const parentTheaterElement = event.target.closest(".theater");

      const addMovieModalContent = `
      <div id='add-movie-form'>
        <input id='add-movie-title' type='text'>
      </div>
      `;

      try {
        await openModal("Add Movie", addMovieModalContent);

        const modalBody = document.getElementById("modalBody");
        const addMovieTitle = modalBody.querySelector("#add-movie-title").value;
        const theaterId = parseInt(parentTheaterElement.dataset.theaterId);

        const theater = this._theaterData.find((theater) => theater.id === theaterId);
        theater.movie = addMovieTitle;

        const movieName = parentTheaterElement.querySelector(`#movieName-${theaterId}`);

        // Remove previous event listener and add a new one
        const addMovieButton = parentTheaterElement.querySelector(".theater-add-movie");
        const newAddMovieButton = addMovieButton.cloneNode(true);
        addMovieButton.parentNode.replaceChild(newAddMovieButton, addMovieButton);
        this.addHandlerChangeMovie(newAddMovieButton);

        newAddMovieButton.classList.remove("theater-add-movie");
        newAddMovieButton.classList.add("theater-change-movie");
        newAddMovieButton.textContent = "Change Movie";

        movieName.textContent = addMovieTitle;
      } catch (error) {
        console.log("An error has occurred.", error);
      }
    });
  }

  addHandlerChangeMovie(movie) {
    movie.addEventListener("click", async (event) => {
      const parentTheaterElement = event.target.closest(".theater");
      const theaterId = parseInt(parentTheaterElement.dataset.theaterId);
      const movieName = parentTheaterElement.querySelector(`#movieName-${theaterId}`);

      const changeMovieModalContent = `
        <div id='change-movie-form'>
          <input id='change-movie-title' type='text' value="${movieName.textContent}">
        </div>
        `;

      try {
        await openModal("Change Movie", changeMovieModalContent);

        const modalBody = document.getElementById("modalBody");
        const changeMovieTitle = modalBody.querySelector("#change-movie-title").value;

        const theater = this._theaterData.find((theater) => theater.id === theaterId);
        theater.movie = changeMovieTitle;

        // TODO: Add trim() and set the value to "-" if it's empty, and change from "Change Movie" to "Add Movie".
        movieName.textContent = changeMovieTitle;
      } catch (error) {
        console.log("An error has occurred.", error);
      }
    });
  }

  addHandlerEditTheater(theater) {
    theater.addEventListener("click", async (event) => {
      const parentTheaterElement = event.target.closest(".theater");
      const theaterId = parseInt(parentTheaterElement.dataset.theaterId);
      const theaterRows = parentTheaterElement.querySelector(`#theaterRows-${theaterId}`);
      const theaterColumns = parentTheaterElement.querySelector(`#theaterColumns-${theaterId}`);

      const editTheaterModalContent = `
      <div id="edit-theater-form">
        <label for="theater-rows">Rows:</label>
        <input id="theater-rows" type="number" min="${MIN_ROWS_COLUMNS}" max="${MAX_ROWS_COLUMNS}" value="${parseInt(theaterRows.textContent)}">
        <label for="theater-columns">Columns:</label>
        <input id="theater-columns" type="number" min="${MIN_ROWS_COLUMNS}" max="${MAX_ROWS_COLUMNS}" value="${parseInt(theaterColumns.textContent)}">
        <div class="parent-container">
        <ul class="showcase">
          <li>
            <div class="seat"> </div>
            <p>N/A</p>
          </li>
          <li>
            <div class="seat selected"> </div>
            <p>Selected</p>
          </li>
          <li>
            <div class="seat occupied"> </div>
            <p>Occupied</p>
          </li>
        </ul>
          <div id="theater-container"></div>
        <div>
      </div>
      `;

      try {
        await openModal("Edit Theater", editTheaterModalContent, true);

        const modalBody = document.getElementById("modalBody");
        const editTheaterRows = modalBody.querySelector("#theater-rows").value;
        const editTheaterColumns = modalBody.querySelector("#theater-columns").value;

        const theater = this._theaterData.find((theater) => theater.id === theaterId);
        theater.rows = editTheaterRows;
        theater.columns = editTheaterColumns;

        // TODO: Add trim() and set the value to "-" if it's empty, and change from "Change Movie" to "Add Movie".
        theaterRows.textContent = editTheaterRows;
        theaterColumns.textContent = editTheaterColumns;
      } catch (error) {
        console.log("An error has occurred.", error);
      }
    });
  }

  addHandlerDeleteTheater(theater) {
    theater.addEventListener("click", async (event) => {
      const parentTheaterElement = event.target.closest(".theater");

      const editTheaterModalContent = `
      <div id="edit-theater-form">
        <p>Are you sure you want to delete this theater?</p>
      </div>
      `;

      try {
        await openModal("Delete Theater", editTheaterModalContent);

        const theaterId = parseInt(parentTheaterElement.dataset.theaterId);

        this._theaterData = this._theaterData.filter((theater) => theater.id !== theaterId);

        const allTheaters = document.getElementById("all-theaters");
        const theaterElement = allTheaters.querySelector(`[data-theater-id="${theaterId}"]`);
        theaterElement.remove();
      } catch (error) {
        console.log("An error has occurred.", error);
      }
    });
  }

  addHandlerEditSeats() {}

  addHandlerBookSeats() {}

  _generateMarkup() {
    return `
      <div>
        <h1 class="welcome-header">Welcome ${this._userData.type}</h1>
        <div class="all-theaters-header">
          <h2>All Theaters</h2>
          ${this._userData.type === "admin" ? '<button id="add-theater-button">Add Theater</button>' : ""}
        </div>
        <div id="all-theaters">
          ${this._theaterData.map(this._generateMarkupTheater).join("")}
        </div>
        <br><br>
      </div>`;
  }

  _generateMarkupTheater(theater) {
    return `
      <div class="theater" data-theater-id="${theater.id}">
        <p>Movie: <b id="movieName-${theater.id}">${theater.movie}</b></p>
        <p>Rows: <b id="theaterRows-${theater.id}">${theater.rows}</b></p>
        <p>Columns: <b id="theaterColumns-${theater.id}">${theater.columns}</b></p>
        ${theater.movie != "-" ? "<button class='theater-change-movie'>Change Movie</button>" : "<button class='theater-add-movie'>Add Movie</button>"}
        <button class="theater-edit-theater">Edit Theater</button>
        <button class="theater-delete-theater">Delete Theater</button>
      </div>
      `;
  }

  _createNewTheater(rows, columns, theaterId) {
    return `
      <div class="theater" data-theater-id="${theaterId}">
        <p>Movie: <b id="movieName-${theaterId}">-</b></p>
        <p>Rows: <b id="theaterRows-${theaterId}">${rows}</b></p>
        <p>Columns: <b id="theaterColumns-${theaterId}">${columns}</b></p>
        <button class="theater-add-movie">Add Movie</button>
        <button class="theater-edit-theater">Edit Theater</button>
        <button class="theater-delete-theater">Delete Theater</button>
      </div>
      `;
  }
}

export default new TheaterView();
