import { Modal } from "./modal.js";
import { getTheater } from "../../models/theaterModel.js";

class bookSeatsModal extends Modal {
  bookSeatsModalContent = (theaterName, theaterMovie) => {
    return `
    <div id='book-seats-form'>
      <p>${theaterName} - <b>${theaterMovie.title}</b></p>
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

  open = async (event) => {
    const parentTheaterElement = event.target.closest(".theater");
    const theaterId = parseInt(parentTheaterElement.dataset.theaterId);
    const theater = await getTheater(theaterId);

    this.show("Book Seats", this.bookSeatsModalContent(theater.name, theater.movie));

    let seatsList = theater.seats || [];
    const originalSeatsList = theater.seats ? theater.seats.length : 0;

    const theaterContainer = document.getElementById("theater-container");

    // Generate theater seating based on specified rows and columns
    const generateTheaterSeats = (rows, columns) => {
      // Clear existing theater seating
      theaterContainer.innerHTML = "";

      const screenElement = document.createElement("div");
      screenElement.classList.add("screen");
      theaterContainer.appendChild(screenElement);

      // Generate seating layout
      for (let x = 0; x < rows; x++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("theater-row");

        for (let y = 0; y < columns; y++) {
          const seatButton = document.createElement("button");
          seatButton.classList.add("seat");
          rowDiv.appendChild(seatButton);

          // Check if the seat is already booked
          if (seatsList.some((seat) => seat.x === x && seat.y === y)) seatButton.classList.add("occupied");
          else
            seatButton.addEventListener("click", () => {
              // Check if the seat is already marked
              if (seatButton.classList.contains("selected")) {
                seatButton.classList.remove("selected");
                seatsList = seatsList.filter((seat) => !(seat.x === x && seat.y === y));
              } else {
                seatButton.classList.add("selected");
                seatsList.push({ x, y });
              }
            });
        }

        theaterContainer.appendChild(rowDiv);
      }
    };

    generateTheaterSeats(parseInt(theater.rows), parseInt(theater.columns));

    // Return a promise that resolves when the user clicks confirm
    return new Promise((resolve) => {
      // Remove previous event listener and add a new one for confirm button
      const confirmElement = document.getElementById("save-changes-modal");
      const newConfirmElement = confirmElement.cloneNode(true);
      confirmElement.parentNode.replaceChild(newConfirmElement, confirmElement);

      newConfirmElement.addEventListener("click", () => {
        if (seatsList.length && seatsList.length > originalSeatsList) {
          this.close();
          resolve([theater.id, seatsList]); // Resolve the promise when the user clicks confirm
        } else {
          this.showErrorMessage("You must select at least one seat.");
        }
      });
    });
  };
}

export default new bookSeatsModal();
