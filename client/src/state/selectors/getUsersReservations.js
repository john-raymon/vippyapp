import { createSelector } from "reselect";
import isFuture from "date-fns/is_future";

export default createSelector(
  state => {
    const {
      reservations: { reservations, reservationsCount }
    } = state;
    return {
      reservations,
      reservationsCount
    };
  },
  ({ reservations, reservationsCount }) => {
    const [activeReservations, pastReservations] = reservations.reduce(
      ([active = [], past = []], reservation) => {
        if (isFuture(reservation.listing.event.endTime)) {
          return [[...active, reservation], past];
        } else {
          return [active, [...past, reservation]];
        }
      },
      [[], []]
    );
    return {
      activeReservations,
      pastReservations,
      reservationsCount: reservationsCount,
      activeReservationsCount: activeReservations.length,
      pastReservationsCount: pastReservations.length
    };
  }
);
