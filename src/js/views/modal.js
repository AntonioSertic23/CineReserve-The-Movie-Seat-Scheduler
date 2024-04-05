/**
 * Opens a modal with specified title, content, and callback function.
 * @param {string} title - The title of the modal.
 * @param {string} content - The content to be displayed in the modal.
 * @param {function} callback - The callback function to be executed when the confirm button is clicked.
 */
export const openModal = async function (title, content) {
  // Clear previous content
  document.getElementById("modalBody").innerHTML = "";

  // Set modal title and content
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalBody").innerHTML = content;

  // Add event listeners for closing modal
  const closeModalElements = document.querySelectorAll(".close-modal, .close-btn");
  closeModalElements.forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  // Display modal
  document.getElementById("modalContainer").style.display = "block";

  // Return a promise that resolves when the user clicks confirm
  return new Promise((resolve) => {
    // Remove previous event listener and add a new one for confirm button
    const confirmElement = document.getElementById("save-changes-modal");
    const newConfirmElement = confirmElement.cloneNode(true);
    confirmElement.parentNode.replaceChild(newConfirmElement, confirmElement);
    newConfirmElement.addEventListener("click", () => {
      closeModal();
      resolve(); // Resolve the promise when the user clicks confirm
    });
  });
};

/**
 * Closes the modal.
 */
const closeModal = function () {
  document.getElementById("modalContainer").style.display = "none";
};
