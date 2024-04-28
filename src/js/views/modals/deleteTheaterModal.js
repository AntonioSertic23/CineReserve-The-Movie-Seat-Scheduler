import { Modal } from "./modal.js";

/**
 * Represents a modal for deleting a theater.
 */
class DeleteTheaterModal extends Modal {
  /**
   * Generates the content for the delete theater modal.
   * @param {string} theaterName - The name of the theater to be deleted.
   * @returns {string} - The HTML content for the modal.
   */
  deleteTheaterModalContent = (theaterName) => {
    return `
    <div id="edit-theater-form">
      <p>Are you sure you want to delete <b>${theaterName}</b> theater?</p>
    </div>
    `;
  };

  /**
   * Opens the delete theater modal.
   * @param {Event} event - The event triggering the modal opening.
   * @returns {Promise} - A promise that resolves with the ID of the theater to be deleted when confirmed.
   */
  open = async (event) => {
    const parentTheaterElement = event.target.closest(".theater");
    const theaterId = parseInt(parentTheaterElement.dataset.theaterId);
    const theaterName = document.getElementById(`theaterName-${theaterId}`).textContent;

    this.show("Delete Theater", this.deleteTheaterModalContent(theaterName));

    // Return a promise that resolves when the user clicks confirm
    return new Promise((resolve) => {
      // Remove previous event listener and add a new one for confirm button
      const confirmElement = document.getElementById("save-changes-modal");
      const newConfirmElement = confirmElement.cloneNode(true);
      confirmElement.parentNode.replaceChild(newConfirmElement, confirmElement);

      newConfirmElement.addEventListener("click", () => {
        this.close();
        resolve(theaterId); // Resolve the promise when the user clicks confirm
      });
    });
  };
}

export default new DeleteTheaterModal();
