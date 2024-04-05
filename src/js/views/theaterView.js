import View from "./view.js";
import { openModal } from "./modal.js";

class TheaterView extends View {
  _parentElement = document.querySelector(".container");

  addHandlerAddTheater() {
    const allTheaters = document.getElementById("all-theaters");
    const addTheaterButton = document.getElementById("add-theater-button");

    addTheaterButton.addEventListener("click", async () => {
      // TODO: Create a theater layout generated from buttons for each seat in it, based on the number of rows and columns entered by the user.
      const editMovieModalContent = `
      <div id="add-theater-form">
        <input id="add-theater-rows" type="number">
        <input id="add-theater-columns" type="number">
      </div>
      `;

      try {
        await openModal("Uredi film", editMovieModalContent);

        const modalBody = document.getElementById("modalBody");
        const addTheaterRows = modalBody.querySelector("#add-theater-rows").value;
        const addTheaterColumns = modalBody.querySelector("#add-theater-columns").value;
        const nextTheaterId = this._theaterData.at(-1).id + 1;

        allTheaters.insertAdjacentHTML("beforeend", this._createNewTheater(addTheaterRows, addTheaterColumns, nextTheaterId));
      } catch (error) {
        console.log("Korisnik je odustao od modala ili se dogodila greška");
      }
    });
  }

  addHandlerChangeMovie() {
    const theaterchangeMovie = document.querySelectorAll(".theater-change-movie");

    theaterchangeMovie.forEach((changeMovie) =>
      changeMovie.addEventListener("click", (event) => {
        const parentTheaterElement = event.target.closest(".theater");
        const changeMovieForm = parentTheaterElement.querySelector("#change-movie-form");

        changeMovieForm.style.display = "block";

        const changeMovieTitle = parentTheaterElement.querySelector("#change-movie-title");
        const changeMovieCancel = parentTheaterElement.querySelector("#change-movie-cancel");
        const changeMovieChange = parentTheaterElement.querySelector("#change-movie-change");

        changeMovieCancel.addEventListener("click", () => {
          changeMovieTitle.value = "";
          changeMovieForm.style.display = "none";
        });

        changeMovieChange.addEventListener("click", () => {
          console.log(parentTheaterElement.dataset.theaterId);
        });
      })
    );
  }

  addHandlerAddMovie() {
    const theaterAddMovie = document.querySelectorAll(".theater-add-movie");

    theaterAddMovie.forEach((addMovie) =>
      addMovie.addEventListener("click", (event) => {
        const parentTheaterElement = event.target.closest(".theater");
        const addMovieForm = parentTheaterElement.querySelector("#add-movie-form");

        addMovieForm.style.display = "block";

        const addMovieTitle = parentTheaterElement.querySelector("#add-movie-title");
        const addMovieCancel = parentTheaterElement.querySelector("#add-movie-cancel");
        const addMovieAdd = parentTheaterElement.querySelector("#add-movie-add");

        addMovieCancel.addEventListener("click", () => {
          addMovieTitle.value = "";
          addMovieForm.style.display = "none";
        });

        addMovieAdd.addEventListener("click", () => {
          const theaterId = parseInt(parentTheaterElement.dataset.theaterId);

          const theater = this._theaterData.find((theater) => theater.id === theaterId);
          theater.movie = addMovieTitle.value;

          const movieName = parentTheaterElement.querySelector(`#movieName-${theaterId}`);
          movieName.textContent = addMovieTitle.value;

          addMovieTitle.value = "";
          addMovieForm.style.display = "none";
        });
      })
    );
  }

  addHandlerEditTheater() {
    const theaterEditTheater = document.querySelectorAll(".theater-edit-theater");

    theaterEditTheater.forEach((editTheater) =>
      editTheater.addEventListener("click", (event) => {
        // TODO: Create a form similar to the one for creating a new theater, pre-filled with existing values. Upon clicking the Save button, save the changes.
        console.log("edit");
      })
    );
  }

  addHandlerDeleteTheater() {
    const theaterDeleteTheater = document.querySelectorAll(".theater-delete-theater");

    theaterDeleteTheater.forEach((deleteTheater) =>
      deleteTheater.addEventListener("click", (event) => {
        // TODO: Create Yes and No buttons. Clicking Yes deletes the theater, while clicking No hides both buttons.
        console.log("delete");
      })
    );
  }

  addHandlerEditSeats() {}

  addHandlerBookSeats() {}

  _createNewTheater(rows, columns, theaterId) {
    return `
      <div class="theater">
        <p>Movie: <b id="movieName-${theaterId}">-</b></p>
        <p>Rows: ${rows}</p>
        <p>Columns: ${columns}</p>
        <button class="theater-add-movie">Add Movie</button>
        <button class="theater-edit-theater">Edit Theater</button>
        <button class="theater-delete-theater">Delete Theater</button>
      </div>
      <hr>`;
  }

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

        ${
          theater.movie != "-"
            ? "<div id='change-movie-form' style='display: none'><br><input id='change-movie-title' type='text'><button id='change-movie-cancel'>Cancel</button><button id='change-movie-change'>Save</button></div>"
            : "<div id='add-movie-form' style='display: none'><br><input id='add-movie-title' type='text'><button id='add-movie-cancel'>Cancel</button><button id='add-movie-add'>Add</button></div>"
        }
      </div>
      <hr>`;
  }
}

export default new TheaterView();
