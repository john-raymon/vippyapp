const initialState = {
  events: [],
  eventCount: 0,
  listings: [],
  listingCount: 0,
  reservations: [],
  reservationCount: 0,
  stats: {}
};

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case "FETCH_VENUES_STATS_FULFILLED":
      return {
        ...state,
        stats: payload.stats
      };
    case "FETCH_VENUES_RESERVATIONS_FULFILLED":
      return {
        ...state,
        reservations: payload.reservations,
        reservationCount: payload.reservationCount
      };
    case "FETCH_VENUES_EVENTS_FULFILLED":
      return {
        ...state,
        events: payload.events,
        eventCount: payload.eventsCount
      };
    case "FETCH_VENUES_LISTINGS_FULFILLED":
      return {
        ...state,
        listings: payload.listings,
        listingCount: payload.listingCount
      };
    case "USER_LOGOUT":
      return initialState;
    default:
      return state;
  }
};
