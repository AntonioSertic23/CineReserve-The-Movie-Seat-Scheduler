export const state = [];

export const loadTheater = async function () {
  try {
    // TODO: Implement data retrieval from Firebase.

    const allTheatersData = [
      { id: 1, movie: "Shrek 3", rows: 4, columns: 7 },
      { id: 2, movie: "-", rows: 3, columns: 6 },
    ];

    allTheatersData.forEach((theater) =>
      state.push({
        id: theater.id,
        movie: theater.movie,
        rows: theater.rows,
        columns: theater.columns,
      })
    );
  } catch (err) {
    alert(err);
  }
};
