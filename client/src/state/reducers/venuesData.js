const initialState = {
  events: [],
  eventCount: 0,
  listings: [],
  listingCount: 0,
  reservations: [],
  reservationCount: 0
};

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case "FETCH_VENUES_RESERVATIONS_FULFILLED":
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
