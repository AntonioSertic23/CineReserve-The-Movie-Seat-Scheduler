export let state = [];

export const loadTheater = async (theaters) => {
  state = theaters;
};

export const getTheater = (theaterId) => {
  return state.find((theater) => theater?.id === theaterId);
};

export const getNextTheaterId = () => {
  return state?.at(-1) ? state.at(-1).id + 1 : 0;
};

export const addTheater = async (theater) => {
  if (state) {
    state.push(theater);
  } else {
    state = [theater];
  }
};

export const deleteTheater = (theaterId) => {
  state = state.filter((theater) => theater?.id !== theaterId);
};

export const updateMovie = (theaterId, movie) => {
  const theater = state.find((theater) => theater?.id === theaterId);
  theater.movie.title = movie.title;
  theater.movie.year = movie.year;
  theater.movie.image = movie.image;
};

export const editTheater = (theaterId, theaterName, theaterRows, theaterColumns) => {
  const theater = state.find((theater) => theater?.id === theaterId);
  theater.name = theaterName;
  theater.rows = theaterRows;
  theater.columns = theaterColumns;
};

export const bookSeats = (theaterId, seatsList) => {
  const theater = state.find((theater) => theater?.id === theaterId);
  theater.seats = seatsList;
};
