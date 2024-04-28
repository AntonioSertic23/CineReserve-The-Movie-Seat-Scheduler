import { Modal } from "./modal.js";
import { AJAX, renderSpinner } from "../../helpers.js";
import { API_URL, API_KEY } from "../../config.js";

/**
 * Represents a modal for changing the movie in a theater.
 */
class ChangeMovieModal extends Modal {
  /**
   * Generates the content for the change movie modal.
   * @param {string} movieName - The name of the current movie.
   * @returns {string} - The HTML content for the modal.
   */
  changeMovieModalContent = (movieName) => {
    return `
    <div id='change-movie-form'>
      <div id="search-actions-container">
        <label for="movie-title">Title:</label>
        <input id='movie-title' type='text' value="${movieName}">
        <button id="search-movies">Search</button>
      </div>
      <div id="search-results-container"></div>
    </div>
    `;
  };

  /**
   * Searches for movies based on the provided search term.
   * @param {string} search - The search term.
   * @param {number} theaterId - The ID of the theater.
   * @param {Function} resolve - The function to resolve the promise.
   */
  searchMovies = async (search, theaterId, resolve) => {
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

          resolve([theaterId, movie]);
          this.close();
        })
      );
    } catch (error) {
      this.showErrorMessage(`Error while fetching movies: ${error}`);
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
   * Opens the change movie modal.
   * @param {Event} event - The event triggering the modal opening.
   * @returns {Promise} - A promise that resolves with theater ID and selected movie when confirmed.
   */
  open = async (event) => {
    const parentTheaterElement = event.target.closest(".theater");
    const theaterId = parseInt(parentTheaterElement.dataset.theaterId);
    const movieName = parentTheaterElement.querySelector(`#movieName-${theaterId}`).textContent;

    this.show("Change Movie", this.changeMovieModalContent(movieName), false);

    const searchMoviesButton = document.getElementById("search-movies");
    const movieTitle = document.getElementById("movie-title");
    return new Promise((resolve) => {
      searchMoviesButton.addEventListener("click", async () => await this.searchMovies(movieTitle.value, theaterId, resolve));
    });
  };
}

export default new ChangeMovieModal();
