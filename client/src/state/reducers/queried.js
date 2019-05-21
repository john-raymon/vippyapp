const initialState = {
  events: null,
  eventsCount: 0,
  listings: null,
  listingsCount: 0,
  isLoading: false,
  error: null
};

export default (state = initialState, { type, payload = {} }) => {
  const { isLoading, error } = initialState; // to reset status, loading state
  switch (type) {
    case `${"FETCH_EVENTS_BY_ZIP"}_FULFILLED`:
      return {
        ...state,
        error,
        isLoading,
        eventsCount: payload.nearByEventsCount,
        events: payload.nearByEvents,
        listingsCount: payload.nearByListingsCount,
        listings: payload.nearByListings
      };
    case `${"FETCH_EVENTS_BY_ZIP"}_PENDING`:
      return {
        ...state,
        listings: [],
        events: [],
        isLoading: true
      };
    case `${"FETCH_EVENTS_BY_ZIP"}_REJECTED`:
      return {
        ...state,
        isLoading,
        error: payload
      };
    default:
      return state;
  }
};
