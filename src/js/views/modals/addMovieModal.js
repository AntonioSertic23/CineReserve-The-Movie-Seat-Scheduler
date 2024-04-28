import { Modal } from "./modal.js";
import { AJAX, renderSpinner } from "../../helpers.js";
import { API_URL, API_KEY } from "../../config.js";

class addMovieModal extends Modal {
  addMovieModalContent = () => {
    return `
    <div id='add-movie-form'>
      <div id="search-actions-container">
        <label for="movie-title">Title:</label>
        <input id='movie-title' type='text'>
        <button id="search-movies">Search</button>
      </div>
      <div id="search-results-container"></div>
    </div>
    `;
  };

  seachMovies = async (search) => {
    try {
      this.clearErrorMessage();
      const searchresultsContainer = document.getElementById("search-results-container");
      const margin = "50px auto 50px 95%";
      renderSpinner(searchresultsContainer, margin);

      const data = await AJAX(`${API_URL}?s=${search}&type=movie&apikey=${API_KEY}`);

      searchresultsContainer.innerHTML = "";
      if (data.Error) {
        this.showErrorMessage(`No movies found with that name.`);
        return;
      }

      const results = data.Search.map((movie) => {
        return {
          id: movie.imdbID,
          title: movie.Title,
          image: movie.Poster,
          year: movie.Year,
        };
      });

      const markup = `${results.map(this.generateMarkupSearchMovie).join("")}`;
      searchresultsContainer.insertAdjacentHTML("afterbegin", markup);

      const addButtons = searchresultsContainer.querySelectorAll(".add-button");
      addButtons.forEach((btn) =>
        btn.addEventListener("click", () => {
          const movieElement = btn.closest(".movie");
          const titleElement = movieElement.querySelector(".movie-title");
          document.getElementById("movie-title").value = titleElement.innerText;
        })
      );
    } catch (error) {
      console.error("Error while fetching movies:", error);
    }
  };

  generateMarkupSearchMovie = (movie) => {
    return `
    <div class="movie" data-movie-id="${movie.id}">
      <div class="left">
        <img src="${movie.image}" />
      </div>
      <div class="right">
        <p>Title: <b class="movie-title">${movie.title}</b></p>
        <p>Year: <b>${movie.year}</b></p>
        <button class="add-button">Add</button>
      </div>
    </div>
    `;
  };

  open = async (event) => {
    this.show("Add Movie", this.addMovieModalContent());

    const parentTheaterElement = event.target.closest(".theater");
    const addMovieTitle = document.getElementById("movie-title");
    const theaterId = parseInt(parentTheaterElement.dataset.theaterId);

    const searchMoviesButton = document.getElementById("search-movies");
    const movieTitle = document.getElementById("movie-title");
    searchMoviesButton.addEventListener("click", async () => await this.seachMovies(movieTitle.value));
    // TODO: Add a spinner to rotate while the search is executing

    // Return a promise that resolves when the user clicks confirm
    return new Promise((resolve) => {
      // Remove previous event listener and add a new one for confirm button
      const confirmElement = document.getElementById("save-changes-modal");
      const newConfirmElement = confirmElement.cloneNode(true);
      confirmElement.parentNode.replaceChild(newConfirmElement, confirmElement);

      newConfirmElement.addEventListener("click", () => {
        if (addMovieTitle.value) {
          this.close();
          resolve([theaterId, addMovieTitle.value]); // Resolve the promise when the user clicks confirm
        } else {
          this.showErrorMessage("The movie title is a required field.");
        }
      });
    });
  };
}

export default new addMovieModal();
