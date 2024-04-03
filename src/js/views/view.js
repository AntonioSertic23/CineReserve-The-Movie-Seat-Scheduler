export default class View {
  _data;
  _theaterData;

  render(type) {
    this._data = type;
    this._theaterData = [
      { id: 1, movie: "Shrek 3", rows: 4, columns: 7 },
      { id: 2, movie: "-", rows: 3, columns: 6 },
    ];
    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
