import { createSelector } from "reselect";
import _get from "lodash/get";
import { formatEventDate } from "./../../utils/dateFns";

export default createSelector(
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
    const { listings, events } = state;
    // only map if listings no longer null
    const newEvents =
      events &&
      events.map(event => ({
        ...event,
        date: formatEventDate(event.date)
      }));
    return {
      ...state,
      events: newEvents
    };
  }
);
