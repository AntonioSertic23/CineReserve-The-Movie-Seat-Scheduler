import { Modal } from "./modal.js";
import { AJAX } from "../../helpers.js";
import { API_URL, API_KEY } from "../../config.js";

class changeMovieModal extends Modal {
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

  seachMovies = async (search) => {
    try {
      const data = await AJAX(`${API_URL}?s=${search}&type=movie&apikey=${API_KEY}`);

      if (data.Error) {
        this.showErrorMessage(`<p class="error-message">No movies found with that name.</p>`);
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

      const searchresultsContainer = document.getElementById("search-results-container");
      searchresultsContainer.innerHTML = "";
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
      this.showErrorMessage(`<p class="error-message">Error while fetching movies: ${error}</p>`);
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
    const parentTheaterElement = event.target.closest(".theater");
    const theaterId = parseInt(parentTheaterElement.dataset.theaterId);
    const movieName = parentTheaterElement.querySelector(`#movieName-${theaterId}`).textContent;

    this.show("Add Movie", this.changeMovieModalContent(movieName));

    const changeMovieTitle = document.getElementById("movie-title");
    const searchMoviesButton = document.getElementById("search-movies");
    searchMoviesButton.addEventListener("click", async () => await this.seachMovies(changeMovieTitle.value));
    // TODO: Add a spinner to rotate while the search is executing

    // Return a promise that resolves when the user clicks confirm
    return new Promise((resolve) => {
      // Remove previous event listener and add a new one for confirm button
      const confirmElement = document.getElementById("save-changes-modal");
      const newConfirmElement = confirmElement.cloneNode(true);
      confirmElement.parentNode.replaceChild(newConfirmElement, confirmElement);

      newConfirmElement.addEventListener("click", () => {
        if (changeMovieTitle.value.trim()) {
          this.close();
          resolve([theaterId, changeMovieTitle.value.trim()]); // Resolve the promise when the user clicks confirm
        } else {
          this.showErrorMessage('<p class="error-message">The movie title is a required field.</p>');
        }
      });
    });
  };
}

export default new changeMovieModal();
