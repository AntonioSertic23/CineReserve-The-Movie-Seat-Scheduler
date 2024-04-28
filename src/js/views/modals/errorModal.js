import { Modal } from "./modal.js";

/**
 * Represents a modal for displaying error messages.
 */
class ErrorModal extends Modal {
  /**
   * Generates the content for the error modal.
   * @param {string} message - The error message to display.
   * @returns {string} - The HTML content for the modal.
   */
  errorModalContent = (message) => {
    return `
    <div id='error-container'>
      <p>${message}</p>
    </div>
    `;
  };

  /**
   * Opens the error modal.
   * @param {string} message - The error message to display.
   * @returns {Promise} - A promise that resolves when the user acknowledges the error.
   */
  open = async (message) => {
    this.show("Error", this.errorModalContent(message));

    // Return a promise that resolves when the user acknowledges the error
    return new Promise((resolve) => {
      // Remove previous event listener and add a new one for confirm button
      const confirmElement = document.getElementById("save-changes-modal");
      const newConfirmElement = confirmElement.cloneNode(true);
      confirmElement.parentNode.replaceChild(newConfirmElement, confirmElement);

      newConfirmElement.addEventListener("click", () => {
        this.close();
        resolve(); // Resolve the promise when the user acknowledges the error
      });
    });
  };
}

export default new ErrorModal();
