import View from "./view.js";

class TheaterView extends View {
  _parentElement = document.querySelector(".container");

  addHandlerAddTheater() {
    const addTheaterElement = document.getElementById("addTheater");
    addTheaterElement.addEventListener("click", (e) => {
      // TODO: Display the form for adding a theater.
    });
  }

  _generateMarkup() {
    console.log(this._data);
    return `
      <div>
        <h1>Welcome ${this._data}</h1>
        ${this._data === "admin" ? '<button id="addTheater">Add Theater</button>' : ""}
        <br>
        <br>
        <div class="all_theaters">
            ...
        </div>
        <br>
        <br>
      </div>`;
  }
}

export default new TheaterView();
