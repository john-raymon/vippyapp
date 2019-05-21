import { createSelector } from "reselect";
import _get from "lodash/get";
import format from "date-fns/format";

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
        date: format(new Date(event.date), "MMMM MM, YYYY, [on a] dddd")
      }));
    return {
      ...state,
      events: newEvents
    };
  }
);
