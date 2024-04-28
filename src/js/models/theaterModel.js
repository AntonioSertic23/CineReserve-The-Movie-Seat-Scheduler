/**
 * Represents the current state of theaters.
 */
export let state = [];

/**
 * Loads theaters into the application state.
 * @param {Array} theaters - The array of theaters to be loaded.
 */
export const loadTheater = async (theaters) => {
  state = theaters;
};

/**
 * Retrieves a theater by its ID.
 * @param {number} theaterId - The ID of the theater to retrieve.
 * @returns {Object|undefined} - The theater object if found, otherwise undefined.
 */
export const getTheater = (theaterId) => {
  return state.find((theater) => theater?.id === theaterId);
};

/**
 * Gets the ID for the next theater to be added.
 * @returns {number} - The ID for the next theater.
 */
export const getNextTheaterId = () => {
  return state?.at(-1) ? state.at(-1).id + 1 : 0;
};

/**
 * Adds a new theater to the application state.
 * @param {Object} theater - The theater object to be added.
 */
export const addTheater = async (theater) => {
  if (state) {
    state.push(theater);
  } else {
    state = [theater];
  }
};

/**
 * Deletes a theater from the application state.
 * @param {number} theaterId - The ID of the theater to be deleted.
 */
export const deleteTheater = (theaterId) => {
  state = state.filter((theater) => theater?.id !== theaterId);
};

/**
 * Updates movie details for a theater.
 * @param {number} theaterId - The ID of the theater to update.
 * @param {Object} movie - The updated movie object.
 */
export const updateMovie = (theaterId, movie) => {
  const theater = state.find((theater) => theater?.id === theaterId);
  theater.movie.title = movie.title;
  theater.movie.year = movie.year;
  theater.movie.image = movie.image;
};

/**
 * Edits details of a theater.
 * @param {number} theaterId - The ID of the theater to edit.
 * @param {string} theaterName - The new name of the theater.
 * @param {number} theaterRows - The new number of rows in the theater.
 * @param {number} theaterColumns - The new number of columns in the theater.
 */
export const editTheater = (theaterId, theaterName, theaterRows, theaterColumns) => {
  const theater = state.find((theater) => theater?.id === theaterId);
  theater.name = theaterName;
  theater.rows = theaterRows;
  theater.columns = theaterColumns;
};

/**
 * Books seats in a theater.
 * @param {number} theaterId - The ID of the theater to book seats in.
 * @param {Array} seatsList - The list of seats to be booked.
 */
export const bookSeats = (theaterId, seatsList) => {
  const theater = state.find((theater) => theater?.id === theaterId);
  theater.seats = seatsList;
};
