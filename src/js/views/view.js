export default class View {
  _userData;
  _theaterData;

  render(userData, theterData) {
    this._userData = userData.user;
    this._theaterData = theterData;
    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
