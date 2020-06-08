import { createSelector } from "reselect";
import isFuture from "date-fns/is_future";

export default createSelector(
  state => state.venuesData.listings,
  (_, props) => props.venueDashoardFilters.onlyFutureListings,
  (_, props) => props.venueDashoardFilters.onlyPastListings,
  (listings, onlyFutureListings, onlyPastListings) => {
    return listings.filter(l => {
      if (onlyFutureListings && !onlyPastListings) {
        return isFuture(l.event.endTime);
      } else if (onlyPastListings) {
        return !isFuture(l.event.endTime);
      }
      return true;
    });
  } // transformer
);
