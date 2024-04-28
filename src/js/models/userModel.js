/**
 * Represents the current state of the user.
 */
export const state = {
  user: {},
};

/**
 * Loads user data into the application state.
 * @param {Object} user - The user object to be loaded.
 */
export const loadUser = async (user) => {
  state.user = user;
};
