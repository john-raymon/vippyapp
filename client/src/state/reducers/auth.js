const initialState = {
  isAuth: false,
  user: null
};

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case `${"LOGIN"}_FULFILLED`:
      return { ...state, isAuth: true, user: payload.user };
    case "LOGOUT":
    case `${"LOGIN"}_REJECTED`:
      return { ...state, isAuth: initialState.isAuth, user: initialState.null };
    default:
      return state;
  }
};
