import { openModal } from "./modal.js";

class TheaterView {
  _parentElement = document.querySelector(".container");
  _userData;
  _theaterData;

  render(userData, theterData) {
    this._userData = userData.user;
    this._theaterData = theterData;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", this._generateMarkup());

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
      // TODO: Create a theater layout generated from buttons for each seat in it, based on the number of rows and columns entered by the user.
      const eaddTheaterModalContent = `
      <div id="add-theater-form">
        <input id="add-theater-rows" type="number">
        <input id="add-theater-columns" type="number">
      </div>
      `;

      try {
        await openModal("Add Theater", eaddTheaterModalContent);

        const modalBody = document.getElementById("modalBody");
        const addTheaterRows = modalBody.querySelector("#add-theater-rows").value;
        const addTheaterColumns = modalBody.querySelector("#add-theater-columns").value;
        const nextTheaterId = this._theaterData.at(-1).id + 1;

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

        // Remove previous event listener and add a new one for confirm button
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

      const changeMovieModalContent = `
        <div id='change-movie-form'>
          <input id='change-movie-title' type='text'>
        </div>
        `;

      try {
        await openModal("Change Movie", changeMovieModalContent);

        const modalBody = document.getElementById("modalBody");
        const changeMovieTitle = modalBody.querySelector("#change-movie-title").value;
        const theaterId = parseInt(parentTheaterElement.dataset.theaterId);

        const theater = this._theaterData.find((theater) => theater.id === theaterId);
        theater.movie = changeMovieTitle;

        const movieName = parentTheaterElement.querySelector(`#movieName-${theaterId}`);

        // TODO: Add trim() and set the value to "-" if it's empty, and change from "Change Movie" to "Add Movie".
        movieName.textContent = changeMovieTitle;
      } catch (error) {
        console.log("The user has canceled the modal or an error has occurred.");
      }
    });
  }

  addHandlerEditTheater(theater) {
    theater.addEventListener("click", (event) => {
      // TODO: Create a form similar to the one for creating a new theater, pre-filled with existing values. Upon clicking the Save button, save the changes.
      console.log("edit");
    });
  }

  addHandlerDeleteTheater(theater) {
    theater.addEventListener("click", (event) => {
      // TODO: Create Yes and No buttons. Clicking Yes deletes the theater, while clicking No hides both buttons.
      console.log("delete");
    });
  }

  addHandlerEditSeats() {}

  addHandlerBookSeats() {}

  _generateMarkup() {
    return `
      <div>
        <h1>Welcome ${this._userData.type}</h1>
        ${this._userData.type === "admin" ? '<button id="add-theater-button">Add Theater</button>' : ""}
        <br>
        <br>
        <div id="add-theater-form" style="display: none">
          <input id="add-theater-rows" type="number">
          <input id="add-theater-columns" type="number">
          <button id="add-theater-cancel">Cancel</button>
          <button id="add-theater-create">Create</button>
        </div>
        <br><br>
        <div id="all-theaters">
          <h4>All Theaters</h4>
          <hr>
          ${this._theaterData.map(this._generateMarkupTheater).join("")}
        </div>
        <br><br>
      </div>`;
  }

  _generateMarkupTheater(theater) {
    return `
      <div class="theater" data-theater-id="${theater.id}">
        <p>Movie: <b id="movieName-${theater.id}">${theater.movie}</b></p>
        <p>Rows: ${theater.rows}</p>
        <p>Columns: ${theater.columns}</p>
        ${theater.movie != "-" ? "<button class='theater-change-movie'>Change Movie</button>" : "<button class='theater-add-movie'>Add Movie</button>"}
        <button class="theater-edit-theater">Edit Theater</button>
        <button class="theater-delete-theater">Delete Theater</button>
      </div>
      <hr>`;
  }

  _createNewTheater(rows, columns, theaterId) {
    return `
      <div class="theater" data-theater-id="${theaterId}">
        <p>Movie: <b id="movieName-${theaterId}">-</b></p>
        <p>Rows: ${rows}</p>
        <p>Columns: ${columns}</p>
        <button class="theater-add-movie">Add Movie</button>
        <button class="theater-edit-theater">Edit Theater</button>
        <button class="theater-delete-theater">Delete Theater</button>
      </div>
      <hr>`;
  }
}

export default new TheaterView();
