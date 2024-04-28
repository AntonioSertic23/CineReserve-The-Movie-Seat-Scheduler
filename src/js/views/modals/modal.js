export class Modal {
  constructor() {}

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

  close = () => {
    document.getElementById("modalContainer").style.display = "none";

    // Clear previous content
    document.getElementById("modalBody").innerHTML = "";
  };

  showErrorMessage = (message) => {
    this.clearErrorMessage();
    const modalBody = document.getElementById("modalBody");
    const newElement = document.createElement("div");
    newElement.innerHTML = `<p class="error-message">${message}</p>`;
    modalBody.appendChild(newElement);
  };

  clearErrorMessage = () => {
    const errorMessage = document.querySelector(".error-message");
    if (errorMessage) errorMessage.remove();
  };
}
