import addTheaterModal from "./modals/addTheaterModal.js";
import deleteTheaterModal from "./modals/deleteTheaterModal.js";

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
        ${userType === "admin" ? theaterData.map(this._generateAdminMarkupTheater).join("") : theaterData.map(this._generateUserMarkupTheater).join("")}
      </div>
      <br><br>
    </div>`;
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateAdminMarkupTheater(theater) {
    return `
      <div class="theater" data-theater-id="${theater.id}">
        <p>Name: <b data-theater-name>${theater.name}</b></p>
        <p>Movie: <b id="movieName-${theater.id}">${theater.movie}</b></p>
        <p>Rows: <b id="theaterRows-${theater.id}">${theater.rows}</b></p>
        <p>Columns: <b id="theaterColumns-${theater.id}">${theater.columns}</b></p>
        ${theater.movie != "-" ? "<button class='theater-change-movie'>Change Movie</button>" : "<button class='theater-add-movie'>Add Movie</button>"}
        <button class="theater-edit-theater">Edit Theater</button>
        <button class="theater-delete-theater">Delete Theater</button>
      </div>
      `;
  }

  _generateUserMarkupTheater(theater) {
    return `
      <div class="theater" data-theater-id="${theater.id}">
        <p>Name: <b data-theater-name>${theater.name}</b></p>
        <p>Movie: <b id="movieName-${theater.id}">${theater.movie}</b></p>
        ${theater.movie != "-" ? "<button class='theater-edit-seats'>Edit Seats</button>" : "<button class='theater-book-seats'>Book Seats</button>"}
      </div>
      `;
  }

  addHandlerAddTheater(handler) {
    const addTheaterButton = document.getElementById("add-theater-button");

    addTheaterButton.addEventListener("click", async () => {
      try {
        const [nameInput, rowsInput, columnsInput] = await addTheaterModal.open();

        const data = {
          name: nameInput,
          movie: "-",
          rows: rowsInput,
          columns: columnsInput,
        };

        handler(data);
      } catch (error) {
        console.log("An error has occurred.", error);
      }
    });
  }

  addHandlerDeleteTheater(theater, handler) {
    theater.addEventListener("click", async (event) => {
      try {
        const theaterId = await deleteTheaterModal.open(event);

        handler(theaterId);
      } catch (error) {
        console.log("An error has occurred.", error);
      }
    });
  }

  /*
  addHandlerAddMovie(movie) {
    movie.addEventListener("click", async (event) => {
      const parentTheaterElement = event.target.closest(".theater");

      const addMovieModalContent = `
      <div id='add-movie-form'>
        <div id="search-actions-container">
          <input id='movie-title' type='text'>
          <button id="search-movies">Search</button>
        </div>
        <div id="search-results-container"></div>
      </div>
      `;

      try {
        await openModal("Add Movie", addMovieModalContent, false, true);

        const modalBody = document.getElementById("modalBody");
        const addMovieTitle = modalBody.querySelector("#movie-title").value;
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
          <div id="search-actions-container">
            <input id='movie-title' type='text' value="${movieName.textContent}">
            <button id="search-movies">Search</button>
          </div>
          <div id="search-results-container"></div>
        </div>
        `;

      try {
        await openModal("Change Movie", changeMovieModalContent, false, true);

        const modalBody = document.getElementById("modalBody");
        const changeMovieTitle = modalBody.querySelector("#movie-title").value;

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
        </div>
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

  addHandlerEditSeats(movie) {
    movie.addEventListener("click", async (event) => {
      const parentTheaterElement = event.target.closest(".theater");
      const theaterId = parseInt(parentTheaterElement.dataset.theaterId);

      const editSeatsModalContent = `
        <div id='edit-seats-form'>
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
          </div>
        </div>
        `;

      try {
        await openModal("Edit Seats", editSeatsModalContent, false, false);
      } catch (error) {
        console.log("An error has occurred.", error);
      }
    });
  }

  addHandlerBookSeats(movie) {
    movie.addEventListener("click", async (event) => {
      const parentTheaterElement = event.target.closest(".theater");
      const theaterId = parseInt(parentTheaterElement.dataset.theaterId);

      const bookSeatsModalContent = `
        <div id='book-seats-form'>
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
          </div>
        </div>
        `;

      try {
        await openModal("Book Seats", bookSeatsModalContent, false, false);
      } catch (error) {
        console.log("An error has occurred.", error);
      }
    });
  }
 */

  createNewTheater(theater) {
    const allTheaters = document.getElementById("all-theaters");
    const newTheaterMarkup = this._generateAdminMarkupTheater(theater);
    allTheaters.insertAdjacentHTML("beforeend", newTheaterMarkup);
  }
}

export default new TheaterView();
