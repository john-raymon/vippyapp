import { createSelector } from "reselect";
import isFuture from "date-fns/is_future";

export default createSelector(
  state => {
    const {
      reservations: { reservations, reservationCount }
    } = state;
    return {
      reservations,
      reservationCount
    };
  },
  ({ reservations, reservationCount }) => {
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
      totalReservations: reservationCount,
      activeReservationsCount: activeReservations.length,
      pastReservationsCount: pastReservations.length
    };
  }
);
