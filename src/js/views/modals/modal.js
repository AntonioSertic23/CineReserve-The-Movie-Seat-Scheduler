import { MIN_ROWS_COLUMNS, MAX_ROWS_COLUMNS, API_URL, API_KEY } from "../../config.js";
import { AJAX } from "../../helpers.js";

export class Modal {
  constructor() {}

  show = function (title, content) {
    // Set modal title and content
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalBody").innerHTML = content;

    // Add event listeners for closing modal
    const closeModalElements = document.querySelectorAll(".close-modal, .close-btn");
    closeModalElements.forEach((el) => {
      el.addEventListener("click", this.close);
    });

    // Display modal
    document.getElementById("modalContainer").style.display = "block";
  };

  close = function () {
    document.getElementById("modalContainer").style.display = "none";

    // Clear previous content
    document.getElementById("modalBody").innerHTML = "";
  };
  /* 
  Ovo u helper sta ne...

  seachMovies = async function (search) {
    try {
      const data = await AJAX(`${API_URL}?s=${search}&type=movie&apikey=${API_KEY}`);

      // TODO: Add a message to the user in the modal if no movie found.

      const results = data.Search.map((movie) => {
        return {
          id: movie.imdbID,
          title: movie.Title,
          image: movie.Poster,
          year: movie.Year,
        };
      });
      console.log(results);

      const searchresultsContainer = document.getElementById("search-results-container");
      searchresultsContainer.innerHTML = "";
      const markup = `${results.map(generateMarkupSearchMovie).join("")}`;
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

  generateMarkupSearchMovie = function (movie) {
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
   */
}
