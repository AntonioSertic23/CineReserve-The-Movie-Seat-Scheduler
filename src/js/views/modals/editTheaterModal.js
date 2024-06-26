import { Modal } from "./modal.js";
import { MIN_ROWS_COLUMNS, MAX_ROWS_COLUMNS } from "../../config.js";

/**
 * Represents a modal for editing theater details.
 */
class EditTheaterModal extends Modal {
  /**
   * Generates the content for the edit theater modal.
   * @param {string} theaterName - The name of the theater.
   * @param {number} theaterRows - The number of rows in the theater.
   * @param {number} theaterColumns - The number of columns in the theater.
   * @returns {string} - The HTML content for the modal.
   */
  editTheaterModalContent = (theaterName, theaterRows, theaterColumns) => {
    return `
    <div id="edit-theater-form">
      <label for="theater-name">Name:</label>
      <input id="theater-name" type="text" value="${theaterName}">
      <label for="theater-rows">Rows:</label>
      <input id="theater-rows" type="number" min="${MIN_ROWS_COLUMNS}" max="${MAX_ROWS_COLUMNS}" value="${parseInt(theaterRows)}">
      <label for="theater-columns">Columns:</label>
      <input id="theater-columns" type="number" min="${MIN_ROWS_COLUMNS}" max="${MAX_ROWS_COLUMNS}" value="${parseInt(theaterColumns)}">
      <div class="parent-container">
        <ul class="showcase">
          <li>
            <div class="seat"> </div>
            <p>N/A</p>
          </li>
          <li>
            <div class="seat selected"> </div>
            <p>Selected</p>
          </li>
          <li>
            <div class="seat occupied"> </div>
            <p>Occupied</p>
          </li>
        </ul>
        <div id="theater-container"></div>
      </div>
    </div>
    `;
  };

  /**
   * Opens the edit theater modal.
   * @param {Event} event - The event triggering the modal opening.
   * @returns {Promise} - A promise that resolves with the updated theater details when confirmed.
   */
  open = async (event) => {
    const parentTheaterElement = event.target.closest(".theater");
    const theaterId = parseInt(parentTheaterElement.dataset.theaterId);
    const theaterName = document.getElementById(`theaterName-${theaterId}`).textContent;
    const theaterRows = document.getElementById(`theaterRows-${theaterId}`).textContent;
    const theaterColumns = document.getElementById(`theaterColumns-${theaterId}`).textContent;

    this.show("Edit Theater", this.editTheaterModalContent(theaterName, theaterRows, theaterColumns));

    const theaterContainer = document.getElementById("theater-container");
    const nameInput = document.getElementById("theater-name");
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

    // Return a promise that resolves when the user clicks confirm
    return new Promise((resolve) => {
      // Remove previous event listener and add a new one for confirm button
      const confirmElement = document.getElementById("save-changes-modal");
      const newConfirmElement = confirmElement.cloneNode(true);
      confirmElement.parentNode.replaceChild(newConfirmElement, confirmElement);

      newConfirmElement.addEventListener("click", () => {
        if (nameInput.value && rowsInput.value && columnsInput.value) {
          this.close();
          resolve([theaterId, nameInput.value, rowsInput.value, columnsInput.value]); // Resolve the promise when the user clicks confirm
        } else {
          this.showErrorMessage("All fields must be filled in.");
        }
      });
    });
  };
}

export default new EditTheaterModal();
