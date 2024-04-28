import { Modal } from "./modal.js";
import { MIN_ROWS_COLUMNS, MAX_ROWS_COLUMNS } from "../../config.js";

/**
 * Represents a modal for adding a new theater.
 */
class AddTheaterModal extends Modal {
  /**
   * The HTML content for the add theater modal.
   */
  addTheaterModalContent = `
    <div id="add-theater-form">
      <label for="theater-name">Name:</label>
      <input id="theater-name" type="text">
      <label for="theater-rows">Rows:</label>
      <input id="theater-rows" type="number" min="${MIN_ROWS_COLUMNS}" max="${MAX_ROWS_COLUMNS}">
      <label for="theater-columns">Columns:</label>
      <input id="theater-columns" type="number" min="${MIN_ROWS_COLUMNS}" max="${MAX_ROWS_COLUMNS}">
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

  /**
   * Opens the add theater modal.
   * @returns {Promise} - A promise that resolves with theater details when confirmed.
   */
  open = async () => {
    this.show("Add Theater", this.addTheaterModalContent);

    const theaterContainer = document.getElementById("theater-container");
    const rowsInput = document.getElementById("theater-rows");
    const columnsInput = document.getElementById("theater-columns");

    // Generates theater seating based on specified rows and columns
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

    // Adds event listeners for rows and columns input changes
    [rowsInput, columnsInput].forEach((input) =>
      input.addEventListener("change", () => {
        const rowsValue = parseInt(rowsInput.value);
        const columnsValue = parseInt(columnsInput.value);
        generateTheaterSeats(rowsValue, columnsValue);
      })
    );

    if (rowsInput.value && columnsInput.value) generateTheaterSeats(rowsInput.value, columnsInput.value);

    // Returns a promise that resolves when the user clicks confirm
    return new Promise((resolve, reject) => {
      const nameInput = document.getElementById("theater-name");
      const rowsInput = document.getElementById("theater-rows");
      const columnsInput = document.getElementById("theater-columns");

      // Removes previous event listener and adds a new one for confirm button
      const confirmElement = document.getElementById("save-changes-modal");
      const newConfirmElement = confirmElement.cloneNode(true);
      confirmElement.parentNode.replaceChild(newConfirmElement, confirmElement);

      newConfirmElement.addEventListener("click", () => {
        if (nameInput.value && rowsInput.value && columnsInput.value) {
          this.close();
          resolve([nameInput.value, rowsInput.value, columnsInput.value]); // Resolves the promise when the user clicks confirm
        } else {
          this.showErrorMessage("All fields must be filled in.");
        }
      });
    });
  };
}

export default new AddTheaterModal();
