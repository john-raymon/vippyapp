import { createSelector } from "reselect";
import isFuture from "date-fns/is_future";
// import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

// default selector (used for showing upcoming events and listings in landing page "browse tabs")
// events that have not been cancelled and are in the future and have an existing host
// listings that have not been cancelled and have events and booking deadlines both in the future
export default createSelector(
  // default selector returns all listings and events in store state
  state => {
    const {
      queried: { eventsCount, events, listingsCount, listings }
    } = state;
    return {
      eventsCount,
      events,
      listingsCount,
      listings
    };
  },
  state => {
    const { events, listings } = state;
    const allEvents =
      events &&
      events.filter(event => {
        // console.log('testing end time isfuture',isFuture(new Date(event.endTime)))
        // console.log("distance in words", distanceInWordsToNow(new Date(event.endTime)))
        return (
          !event.cancelled && isFuture(new Date(event.endTime)) && event.host
        );
      });
    const eventsById = events
      ? events.reduce(function(obj, event) {
          obj[event.id] = event;
          return obj;
        }, {})
      : {};

    const allListings =
      listings &&
      listings.filter(
        listing =>
          !listing.cancelled &&
          isFuture(new Date(listing.bookingDeadline)) &&
          isFuture(new Date(listing.event.endTime)) &&
          listing.host
      );

    return {
      ...state,
      events: allEvents,
      eventsById: eventsById,
      listings: allListings
    };
  }
);
