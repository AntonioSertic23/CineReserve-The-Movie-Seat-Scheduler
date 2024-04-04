export const state = {
  user: {},
};

export const loadUser = async function (user) {
  state.user = user;
};
