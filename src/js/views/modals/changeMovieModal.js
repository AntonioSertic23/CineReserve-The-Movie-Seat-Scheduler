import { Modal } from "./modal.js";

class changeMovieModal extends Modal {
  changeMovieModalContent = function (movieName) {
    return `
    <div id='change-movie-form'>
      <div id="search-actions-container">
        <input id='movie-title' type='text' value="${movieName}">
        <button id="search-movies">Search</button>
      </div>
      <div id="search-results-container"></div>
    </div>
    `;
  };

  open = async function (event) {
    const parentTheaterElement = event.target.closest(".theater");
    const theaterId = parseInt(parentTheaterElement.dataset.theaterId);
    const movieName = parentTheaterElement.querySelector(`#movieName-${theaterId}`).textContent;

    this.show("Add Movie", this.changeMovieModalContent(movieName));

    const changeMovieTitle = document.getElementById("movie-title");

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
          // TODO: Add a message to the user in the modal.
          console.log("Saving empty values is not allowed!");
        }
      });
    });
  };
}

export default new changeMovieModal();
