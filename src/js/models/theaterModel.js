export let state = [];

export const loadTheater = async function () {
  try {
    // TODO: Implement data retrieval from Firebase.

    const allTheatersData = [
      { id: 1, name: "Theater 1", movie: "Shrek 3", rows: 4, columns: 7 },
      { id: 2, name: "Theater 2", movie: "-", rows: 3, columns: 6 },
    ];

    allTheatersData.forEach((theater) =>
      state.push({
        id: theater.id,
        name: theater.name,
        movie: theater.movie,
        rows: theater.rows,
        columns: theater.columns,
      })
    );
  } catch (err) {
    alert(err);
  }
};

export const addTheater = function (theater) {
  const nextTheaterId = state.at(-1) ? state.at(-1).id + 1 : 1;
  theater.id = nextTheaterId;
  state.push(theater);
  return theater;
};

export const deleteTheater = function (theaterId) {
  state = state.filter((theater) => theater.id !== theaterId);
};

export const addMovie = function (theaterId, movieName) {
  const theater = state.find((theater) => theater.id === theaterId);
  theater.movie = movieName;
};

export const changeMovie = function (theaterId, movieName) {
  const theater = state.find((theater) => theater.id === theaterId);
  theater.movie = movieName;
};
