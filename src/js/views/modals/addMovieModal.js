import { Modal } from "./modal.js";

class addMovieModal extends Modal {
  addMovieModalContent = function () {
    return `
    <div id='add-movie-form'>
      <div id="search-actions-container">
        <input id='movie-title' type='text'>
        <button id="search-movies">Search</button>
      </div>
      <div id="search-results-container"></div>
    </div>
    `;
  };

  open = async function (event) {
    this.show("Add Movie", this.addMovieModalContent());

    const parentTheaterElement = event.target.closest(".theater");
    const addMovieTitle = document.getElementById("movie-title");
    const theaterId = parseInt(parentTheaterElement.dataset.theaterId);

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
          // TODO: Add a message to the user in the modal.
          console.log("Saving empty values is not allowed!");
        }
      });
    });
  };
}

export default new addMovieModal();
