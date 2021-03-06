const initialState = {
  reservations: [],
  reservationCount: 0
};

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case "FETCH_USERS_RESERVATIONS_FULFILLED":
      return {
        ...state,
        reservations: payload.reservations,
        reservationCount: payload.reservationCount
      };
    case "USER_LOGOUT":
      return initialState;
    default:
      return state;
  }
};
