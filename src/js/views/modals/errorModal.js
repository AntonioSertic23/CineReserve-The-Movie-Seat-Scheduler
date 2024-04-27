import { Modal } from "./modal.js";

class errorModal extends Modal {
  errorModalContent = (message) => {
    return `
    <div id='error-container'>
      <p>${message}</p>
    </div>
    `;
  };

  open = async (message) => {
    this.show("Error", this.errorModalContent(message));

    // Return a promise that resolves when the user clicks confirm
    return new Promise((resolve) => {
      // Remove previous event listener and add a new one for confirm button
      const confirmElement = document.getElementById("save-changes-modal");
      const newConfirmElement = confirmElement.cloneNode(true);
      confirmElement.parentNode.replaceChild(newConfirmElement, confirmElement);

      newConfirmElement.addEventListener("click", () => {
        this.close();
        resolve(); // Resolve the promise when the user clicks confirm
      });
    });
  };
}

export default new errorModal();
