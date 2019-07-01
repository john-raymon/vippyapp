import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { ListingCard } from "./Cards";

// Redux Actions
import { fetchReservationsForUser } from "./../state/actions/authActions";

// Selectors
import getUsersReservation from "./../state/selectors/getUsersReservations";

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // fetch reservation
    this.props.fetchReservationsForUserDispatch(this.props.userAgent);
  }

  render() {
    const {
      activeReservationsCount,
      pastReservationsCount,
      pastReservations
    } = this.props;

    const allActiveReservations = () => {
      if (!activeReservationsCount) {
        return (
          <p className="michroma f8 tracked lh-extra white-70 pv2 tl no-underline">
            You have no upcoming reservations
          </p>
        );
      }
    };

    const allPastReservations = () => {
      if (pastReservationsCount) {
        return (
          <Fragment>
            <p className="michroma f8 tracked lh-extra white-70 pv2 tl no-underline">
              You have {pastReservationsCount} past reservation
              {pastReservationsCount > 1 ? `s` : ""}.
            </p>
            <div className="cf w-100">
              {pastReservations.map(({ listing }, key) => {
                return (
                  <ListingCard
                    key={key}
                    bookingDeadline={listing.bookingDeadline}
                    packageTitle={listing.name}
                    eventStartTime={listing.event.startTime}
                    eventEndTime={listing.event.endTime}
                    venueName={listing.host.venueName}
                    guestCount={listing.guestCount}
                    price={listing.bookingPrice}
                    venueStreetAddress={listing.event.address.street}
                    venueCityZipCode={`${listing.event.address.city},${
                      listing.event.address.state
                    } ${listing.event.address.zip}`}
                    images={listing.images}
                    widthClassName="w-25"
                  />
                );
              })}
            </div>
          </Fragment>
        );
      }
      if (!pastReservationsCount) {
        return (
          <p className="michroma f8 tracked lh-extra white-70 pv2 tl no-underline">
            You have no past reservations.
          </p>
        );
      }
    };

    return (
      <div className="flex flex-column center mw8 pt1">
        <h1 className="michroma tracked lh-title white ttc f3 f2-ns pr4 mb2 mw6 mt1">
          Dashboard
        </h1>
        <p className="michroma f7 tracked-1 ttu lh-extra yellow pt2">
          Active Reservations
        </p>
        {allActiveReservations()}
        <p className="michroma f7 tracked-1 ttu lh-extra yellow pt2">
          Past Reservations
        </p>
        {allPastReservations()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...getUsersReservation(state)
  };
};

export default connect(
  mapStateToProps,
  { fetchReservationsForUserDispatch: fetchReservationsForUser }
)(Dashboard);
