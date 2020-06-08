import { createSelector } from "reselect";
import isFuture from "date-fns/is_future";

export default createSelector(
  state => state.venuesData.reservations,
  (_, props) => props.venueDashoardFilters.onlyFutureReservations,
  (_, props) => props.venueDashoardFilters.onlyPastReservations,
  (reservations, onlyFutureReservations, onlyPastReservations) => {
    return reservations.filter(r => {
      if (onlyFutureReservations && !onlyPastReservations) {
        return isFuture(r.listing.event.endTime);
      } else if (onlyPastReservations) {
        return !isFuture(r.listing.event.endTime);
      }
      return true;
    });
  } // transformer
);
