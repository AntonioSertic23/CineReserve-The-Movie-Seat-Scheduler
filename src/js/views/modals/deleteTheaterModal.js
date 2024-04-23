import { Modal } from "./modal.js";

class deleteTheaterModal extends Modal {
  deleteTheaterModalContent = function (theaterName) {
    return `
    <div id="edit-theater-form">
      <p>Are you sure you want to delete <b>${theaterName}</b> theater?</p>
    </div>
    `;
  };

  open = async function (event) {
    const parentTheaterElement = event.target.closest(".theater");
    const theaterName = parentTheaterElement.querySelector('b[data-theater-name=""]').textContent;
    const theaterId = parseInt(parentTheaterElement.dataset.theaterId);

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

export default new deleteTheaterModal();
