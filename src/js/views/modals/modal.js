export class Modal {
  constructor() {}

  show = (title, content) => {
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
