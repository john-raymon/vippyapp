const initialState = {
  isAuth: false,
  user: null
};

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case `USER_REGISTER_FULFILLED`:
      return {
        ...state,
        isAuth: true,
        user: {
          ...payload.user,
          token: undefined
        }
      };
    case `USER_REGISTER_REJECTED`:
      return { ...state, isAuth: initialState.isAuth, user: initialState.user };
    case `${"USER_LOGIN"}_FULFILLED`:
      return { ...state, isAuth: true, user: payload.user };
    case "USER_LOGOUT":
    case `${"USER_LOGIN"}_REJECTED`:
      return { ...state, isAuth: initialState.isAuth, user: initialState.user };
    default:
      return state;
  }
};
