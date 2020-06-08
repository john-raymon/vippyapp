import { createSelector } from "reselect";
import isFuture from "date-fns/is_future";

export default createSelector(
  state => state.venuesData.events,
  (_, props) => props.venueDashoardFilters.onlyFutureEvents,
  (_, props) => props.venueDashoardFilters.onlyPastEvents,
  (events, onlyFutureEvents, onlyPastEvents) => {
    return events.filter(e => {
      if (onlyFutureEvents && !onlyPastEvents) {
        return isFuture(e.endTime);
      } else if (onlyPastEvents) {
        return !isFuture(e.endTime);
      }
      return true;
    });
  } // transformer
);
