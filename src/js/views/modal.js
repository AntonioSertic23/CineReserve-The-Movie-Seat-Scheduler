import { MIN_ROWS_COLUMNS, MAX_ROWS_COLUMNS } from "../config.js";

/**
 * Opens a modal with specified title, content, and callback function.
 * @param {string} title - The title of the modal.
 * @param {string} content - The content to be displayed in the modal.
 * @param {boolean} displayTheater - Flag indicating whether to display theater seating or not.
 * @param {function} callback - The callback function to be executed when the confirm button is clicked.
 */
export const openModal = async function (title, content, displayTheater = false) {
  // Clear previous content
  document.getElementById("modalBody").innerHTML = "";

  // Set modal title and content
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalBody").innerHTML = content;

  // If displayTheater flag is true, enable theater seating display and input validation
  if (displayTheater) {
    const theaterContainer = document.getElementById("theater-container");
    const rowsInput = document.getElementById("theater-rows");
    const columnsInput = document.getElementById("theater-columns");

    // Generate theater seating based on specified rows and columns
    const generateTheaterSeats = (rows, columns) => {
      // Ensure rows and columns values stay within configured bounds
      rows = Math.max(Math.min(rows, MAX_ROWS_COLUMNS), MIN_ROWS_COLUMNS);
      columns = Math.max(Math.min(columns, MAX_ROWS_COLUMNS), MIN_ROWS_COLUMNS);

      // Set input values to adjusted values
      rowsInput.value = rows;
      columnsInput.value = columns;

      // Clear existing theater seating
      theaterContainer.innerHTML = "";

      const screenElement = document.createElement("div");
      screenElement.classList.add("screen");
      theaterContainer.appendChild(screenElement);

      // Generate seating layout
      for (let i = 0; i < rows; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("theater-row");

        for (let j = 0; j < columns; j++) {
          const seatButton = document.createElement("button");
          seatButton.classList.add("seat");
          rowDiv.appendChild(seatButton);
        }

        theaterContainer.appendChild(rowDiv);
      }
    };

    // Add event listeners for rows and columns input changes
    [rowsInput, columnsInput].forEach((input) =>
      input.addEventListener("change", () => {
        const rowsValue = parseInt(rowsInput.value);
        const columnsValue = parseInt(columnsInput.value);
        generateTheaterSeats(rowsValue, columnsValue);
      })
    );

    if (rowsInput.value && columnsInput.value) generateTheaterSeats(rowsInput.value, columnsInput.value);
  }

  // Add event listeners for closing modal
  const closeModalElements = document.querySelectorAll(".close-modal, .close-btn");
  closeModalElements.forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  // Display modal
  document.getElementById("modalContainer").style.display = "block";

  // Return a promise that resolves when the user clicks confirm
  return new Promise((resolve) => {
    const rowsInput = document.getElementById("theater-rows");
    const columnsInput = document.getElementById("theater-columns");

    // Remove previous event listener and add a new one for confirm button
    const confirmElement = document.getElementById("save-changes-modal");
    const newConfirmElement = confirmElement.cloneNode(true);
    confirmElement.parentNode.replaceChild(newConfirmElement, confirmElement);

    newConfirmElement.addEventListener("click", () => {
      if ((!rowsInput && !columnsInput) || (rowsInput.value && columnsInput.value)) {
        closeModal();
        resolve(); // Resolve the promise when the user clicks confirm
      } else {
        // TODO: Add a message to the user in the modal.
        console.log("Saving empty values is not allowed!");
      }
    });
  });
};

/**
 * Closes the modal.
 */
const closeModal = function () {
  document.getElementById("modalContainer").style.display = "none";
};
