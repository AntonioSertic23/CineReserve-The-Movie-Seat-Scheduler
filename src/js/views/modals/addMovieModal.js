import { Modal } from "./modal.js";
import { AJAX, renderSpinner } from "../../helpers.js";
import { API_URL, API_KEY } from "../../config.js";

/**
 * Represents a modal for adding a new movie.
 */
class AddMovieModal extends Modal {
  /**
   * Generates the content for the add movie modal.
   * @returns {string} - The HTML content for the modal.
   */
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

  /**
   * Searches for movies based on the provided search term.
   * @param {string} search - The search term.
   * @param {Event} event - The event triggering the search.
   * @param {Function} resolve - The callback function to resolve the promise.
   */
  searchMovies = async (search, event, resolve) => {
    try {
      this.clearErrorMessage();
      const searchResultsContainer = document.getElementById("search-results-container");
      const margin = "50px auto 50px 95%";
      renderSpinner(searchResultsContainer, margin);

      const data = await AJAX(`${API_URL}?s=${search}&type=movie&apikey=${API_KEY}`);

      searchResultsContainer.innerHTML = "";
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
      searchResultsContainer.insertAdjacentHTML("afterbegin", markup);

      const addButtons = searchResultsContainer.querySelectorAll(".add-button");
      addButtons.forEach((btn) =>
        btn.addEventListener("click", () => {
          const movieElement = btn.closest(".movie");

          const movieImage = movieElement.querySelector("img").getAttribute("src");
          const movieTitle = movieElement.querySelector(".movie-title").innerText;
          const movieYear = movieElement.querySelector(".year-title").innerText;

          const movie = {
            title: movieTitle,
            year: movieYear,
            image: movieImage,
          };

          const parentTheaterElement = event.target.closest(".theater");
          const theaterId = parseInt(parentTheaterElement.dataset.theaterId);

          resolve([theaterId, movie]);
          this.close();
        })
      );
    } catch (error) {
      console.error("Error while fetching movies:", error);
    }
  };

  /**
   * Generates the markup for a search result movie.
   * @param {Object} movie - The movie object.
   * @returns {string} - The HTML markup for the movie.
   */
  generateMarkupSearchMovie = (movie) => {
    return `
    <div class="movie" data-movie-id="${movie.id}">
      <div class="left">
        <img src="${movie.image}" />
      </div>
      <div class="right">
        <p>Title: <b class="movie-title">${movie.title}</b></p>
        <p>Year: <b class="year-title">${movie.year}</b></p>
        <button class="add-button">Add</button>
      </div>
    </div>
    `;
  };

  /**
   * Opens the add movie modal.
   * @param {Event} event - The event triggering the modal opening.
   * @returns {Promise} - A promise that resolves when the modal is closed.
   */
  open = async (event) => {
    this.show("Add Movie", this.addMovieModalContent(), false);

    const searchMoviesButton = document.getElementById("search-movies");
    const movieTitle = document.getElementById("movie-title");
    return new Promise((resolve) => {
      searchMoviesButton.addEventListener("click", async () => await this.searchMovies(movieTitle.value, event, resolve));
    });
  };
}

export default new AddMovieModal();
