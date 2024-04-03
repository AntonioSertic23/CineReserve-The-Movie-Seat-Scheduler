import View from "./view.js";

class TheaterView extends View {
  _parentElement = document.querySelector(".container");

  addHandlerAddTheater() {
    const allTheaters = document.getElementById("all-theaters");
    const addTheaterButton = document.getElementById("add-theater-button");
    const addTheaterForm = document.getElementById("add-theater-form");
    const addTheaterRows = document.getElementById("add-theater-rows");
    const addTheaterColumns = document.getElementById("add-theater-columns");
    const addTheaterCancel = document.getElementById("add-theater-cancel");
    const addTheaterCreate = document.getElementById("add-theater-create");

    addTheaterButton.addEventListener("click", () => {
      addTheaterForm.style.display = "block";
    });

    addTheaterCancel.addEventListener("click", () => {
      addTheaterRows.value = "";
      addTheaterColumns.value = "";
      addTheaterForm.style.display = "none";
    });

    addTheaterCreate.addEventListener("click", () => {
      console.log("Rows:", addTheaterRows.value);
      console.log("Columns:", addTheaterColumns.value);

      allTheaters.insertAdjacentHTML("beforeend", this._createNewTheater(addTheaterRows.value, addTheaterColumns.value));
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
        console.log(addMovieForm);

        const addMovieTitle = parentTheaterElement.querySelector("#add-movie-title");
        const addMovieCancel = parentTheaterElement.querySelector("#add-movie-cancel");
        const addMovieAdd = parentTheaterElement.querySelector("#add-movie-add");

        addMovieCancel.addEventListener("click", () => {
          addMovieTitle.value = "";
          addMovieForm.style.display = "none";
        });

        addMovieAdd.addEventListener("click", () => {
          console.log(parentTheaterElement.dataset.theaterId);
        });
      })
    );
  }

  _createNewTheater(rows, columns) {
    return `
      <div class="theater">
        <p>Movie: <b>-</b></p>
        <p>Rows: ${rows}</p>
        <p>Columns: ${columns}</p>
        <button class="theater-add-movie">Add Movie</button>
        <button class="theater-edit-theater">Edit Theater</button>
        <button class="theater-delete-theater">Delete Theater</button>
      </div>
      <hr>`;
  }

  _generateMarkup() {
    console.log(this._data);
    return `
      <div>
        <h1>Welcome ${this._data}</h1>
        ${this._data === "admin" ? '<button id="add-theater-button">Add Theater</button>' : ""}
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
        <p>Movie: <b>${theater.movie}</b></p>
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
