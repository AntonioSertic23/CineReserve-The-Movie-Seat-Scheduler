/**
 * Represents a modal component for displaying messages and user interactions.
 */
export class Modal {
  constructor() {}

  /**
   * Displays the modal with the provided title and content.
   * @param {string} title - The title of the modal.
   * @param {string} content - The content to be displayed in the modal body.
   * @param {boolean} showConfirmButton - Indicates whether to show the confirm button (default: true).
   */
  show = (title, content, showConfirmButton = true) => {
    // Set modal title and content
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalBody").innerHTML = content;

    const modalFooter = document.querySelector(".modal-footer");
    let confirmButton = document.getElementById("save-changes-modal");

    if (!confirmButton) {
      confirmButton = document.createElement("button");
      confirmButton.setAttribute("id", "save-changes-modal");
      confirmButton.textContent = "Confirm";
      modalFooter.appendChild(confirmButton);
    }

    if (!showConfirmButton) {
      confirmButton.remove();
    }

    // Add event listeners for closing modal
    const closeModalElements = document.querySelectorAll(".close-modal, .close-btn");
    closeModalElements.forEach((el) => {
      el.addEventListener("click", this.close);
    });

    // Display modal
    document.getElementById("modalContainer").style.display = "block";
  };

  /**
   * Closes the modal.
   */
  close = () => {
    document.getElementById("modalContainer").style.display = "none";

    // Clear previous content
    document.getElementById("modalBody").innerHTML = "";
  };

  /**
   * Displays an error message in the modal.
   * @param {string} message - The error message to be displayed.
   */
  showErrorMessage = (message) => {
    this.clearErrorMessage();
    const modalBody = document.getElementById("modalBody");
    const newElement = document.createElement("div");
    newElement.innerHTML = `<p class="error-message">${message}</p>`;
    modalBody.appendChild(newElement);
  };

  /**
   * Clears any displayed error message from the modal.
   */
  clearErrorMessage = () => {
    const errorMessage = document.querySelector(".error-message");
    if (errorMessage) errorMessage.remove();
  };
}
