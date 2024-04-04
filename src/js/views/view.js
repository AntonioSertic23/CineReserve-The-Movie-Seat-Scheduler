export default class View {
  _userData;
  _theaterData;

  render(userData, theterData) {
    this._userData = userData.user;
    this._theaterData = theterData;

    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);

    if (this._userData.type === "admin") {
      this.addHandlerAddTheater();
      this.addHandlerAddMovie();
      this.addHandlerChangeMovie();
      this.addHandlerEditTheater();
      this.addHandlerDeleteTheater();
    } else {
      this.addHandlerEditSeats();
      this.addHandlerBookSeats();
    }
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
