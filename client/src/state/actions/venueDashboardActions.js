export const fetchVenueStats = venueAgent => dispatch => {
  return dispatch({
    type: "FETCH_VENUES_STATS",
    payload: venueAgent.getStats()
  });
};
