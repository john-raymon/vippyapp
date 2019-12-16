import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { ReservationCard, ListingCard } from "./Cards";

// Redux Actions
import { fetchReservationsForUser } from "./../state/actions/authActions";

// Selectors
import getUsersReservation from "./../state/selectors/getUsersReservations";

class Dashboard extends Component {
  componentDidMount() {
    // fetch reservation
    this.props.fetchReservationsForUserDispatch(this.props.userAgent);
  }

  render() {
    if (this.props.isVenueAuth) {
      return (
        <div className="venue-dashboard venue-dashboard__container">
          <section className="venue-dashboard__header-section tw-flex tw-flex-wrap tw-justify-between tw-items-center">
            <div className="venue-dashboard__header-section__left tw-w-1/2">
              <div className="tw-flex tw-flex-row tw-items-center">
                {Object.entries(this.props.venue.images).length ? (
                  <img
                    className="venue-dashboard__image tw-w-20 tw-h-20 tw-rounded-full tw-bg-purple-200"
                    src="/"
                  />
                ) : (
                  <div className="tw-w-20">
                    <div className="venue-dashboard__image--fallback tw-w-full tw-pb-1/1 tw-rounded-full tw-bg-purple-200" />
                  </div>
                )}
                <div className="tw-ml-2 tw-p-2 tw-text-gray-500">
                  <p className="tw-font-mich tw-text-2xs tw-uppercase tw-tracking-widest tw-my-2">
                    {this.props.venue.venueName} /{" "}
                    {this.props.venue.legalVenueName}
                  </p>
                  {!this.props.venue.venueAddress && (
                    <div>
                      <p className="tw-font-mich tw-text-2xs tw-uppercase tw-tracking-widest tw-my-1">
                        335 N Magnolia ave
                      </p>
                      <p className="tw-font-mich tw-text-2xs tw-uppercase tw-tracking-widest tw-my-1">
                        Orlando, FL 32801
                      </p>
                    </div>
                  )}
                  <div>
                    <a className="tw-block tw-font-mich tw-text-2xs tw-uppercase tw-tracking-widest tw-my-2 tw-text-green-500 tw-underline tw-leading-loose">
                      edit account
                    </a>
                    <a className="tw-block tw-font-mich tw-text-2xs tw-uppercase tw-tracking-widest tw-my-2 tw-text-green-500 tw-underline tw-leading-loose">
                      go to stripe account
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="venue-dashboard__header-section__right tw-w-1/2 tw-flex tw-flex-col tw-items-end">
              <button className="button tw-my-2 tw-bg-green-700 tw-px-12 tw-py-3 tw-text-2xs tw-w-full tw-max-w-sm tw-tracking-widest-1 tw-rounded-lg">
                create a new event
              </button>
              <button className="button tw-my-2 tw-bg-green-700 tw-px-12 tw-py-3 tw-text-2xs tw-w-full tw-max-w-sm tw-tracking-widest-1 tw-rounded-lg">
                create a new listing
              </button>
              <button className="button tw-my-2 tw-bg-green-700 tw-px-12 tw-py-3 tw-text-2xs tw-w-full tw-max-w-sm tw-tracking-widest-1 tw-rounded-lg">
                pay out now
              </button>
            </div>
          </section>

          <section className="venue-dashboard__balance-section tw-flex tw-flex-col tw-my-6">
            <div className="tw-flex tw-w-full tw-border-b tw-border-gray-700">
              <div className="tw-w-9/12 tw-flex tw-justify-between">
                <div className="tw-pb-2">
                  <p className="tw-mich tw-text-lg tw-text-white tw-mb-2">
                    $4000.00
                  </p>
                  <p className="tw-mich tw-uppercase tw-text-2xs tw-text-gray-400 tw-leading-snug">
                    available
                    <br />
                    balance
                  </p>
                </div>
                <div className="tw-flex tw-items-end">
                  <div className="tw-pb-2">
                    <p className="tw-mich tw-text-lg tw-text-right tw-text-white">
                      $4000.00
                    </p>
                  </div>
                  <span className="tw-border-r tw-border-gray-700 tw-h-1/2 tw-pl-5" />
                </div>
              </div>
              <div className="tw-w-3/12 tw-flex tw-items-end tw-justify-end">
                <div className="tw-pb-2">
                  <p className="tw-mich tw-text-lg tw-text-right tw-text-white">
                    30
                  </p>
                </div>
              </div>
            </div>
            <div className="tw-flex tw-w-full">
              <div className="tw-w-9/12 tw-flex tw-items-start tw-justify-between">
                <div className="tw-pt-2">
                  <p className="tw-mich tw-text-lg tw-text-white tw-mb-2">
                    $4020.00
                  </p>
                  <p className="tw-mich tw-uppercase tw-text-2xs tw-text-gray-400 tw-leading-snug">
                    total balance
                  </p>
                  <a className="tw-block tw-font-mich tw-text-2xs tw-uppercase tw-tracking-widest tw-my-2 tw-text-green-500 tw-underline tw-leading-loose">
                    view payouts on stripe
                  </a>
                </div>
                <div className="tw-flex tw-self-stretch tw-items-start">
                  <div className="tw-pt-2">
                    <p className="tw-mich tw-uppercase tw-text-2xs tw-text-right tw-text-gray-400 tw-leading-snug">
                      revenue made
                      <br />
                      this week
                    </p>
                  </div>
                  <span className="tw-border-r tw-border-gray-700 tw-h-5/12 tw-pl-5" />
                </div>
              </div>
              <div className="tw-w-3/12 tw-flex tw-items-start tw-justify-end">
                <div className="tw-pt-2">
                  <p className="tw-mich tw-uppercase tw-text-2xs tw-text-right tw-text-gray-400 tw-leading-snug">
                    reservations sold
                    <br />
                    this week
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="tw-flex tw-flex-col tw-my-6">
            <ul className="tw-flex tw-w-full tw-border-b tw-border-gray-600">
              <li className="tw-flex tw-border-r tw-border-gray-600 tw-pt-2 tw-px-4">
                <a className="medium-title tw-text-white tw-uppercase tw-pb-2">
                  all
                </a>
              </li>
              <li className="tw-flex tw-border-r tw-border-gray-600 tw-pt-2 tw-px-4">
                <a className="medium-title tw-text-white tw-uppercase tw-pb-2">
                  events
                </a>
              </li>
              <li className="tw-flex tw-border-r tw-border-gray-600 tw-pt-2 tw-px-4">
                <a className="medium-title tw-text-white tw-uppercase tw-pb-2">
                  listings
                </a>
              </li>
              <li className="tw-flex tw-border-r tw-border-gray-600 tw-pt-2 tw-px-4">
                <a className="medium-title tw-text-white tw-uppercase tw-pb-2">
                  reservations
                </a>
              </li>
            </ul>
          </section>
        </div>
      );
    }
    const {
      activeReservationsCount,
      pastReservationsCount,
      pastReservations,
      activeReservations
    } = this.props;

    const allActiveReservations = () => {
      if (allActiveReservations) {
        return (
          <Fragment>
            <p className="michroma tw-text-sm tracked lh-extra white-70 tw-py-2 tl no-underline">
              You have {activeReservationsCount} active or upcoming reservation
              {activeReservationsCount > 1 ? `s` : ""}.
            </p>
            <div className="cf w-100">
              {activeReservations.map(({ listing, id }, key) => {
                return (
                  <ReservationCard
                    key={key}
                    reservationId={id}
                    listing={listing}
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
                    widthClassName="tw-w-full"
                  />
                );
              })}
            </div>
          </Fragment>
        );
      }
      if (!activeReservationsCount) {
        return (
          <p className="michroma font-base tracked lh-extra white-70 pv2 tl no-underline">
            You have no active/upcoming reservations
          </p>
        );
      }
    };

    const allPastReservations = () => {
      if (pastReservationsCount) {
        return (
          <Fragment>
            <p className="michroma tw-text-sm tracked lh-extra white-70 tw-py-2 tl no-underline">
              You have {pastReservationsCount} past reservation
              {pastReservationsCount > 1 ? `s` : ""}.
            </p>
            <div className="cf w-100">
              {pastReservations.map(({ listing, id }, key) => {
                return (
                  <ReservationCard
                    key={key}
                    listing={listing}
                    reservationId={id}
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
                    widthClassName="w-100"
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
      <div className="flex flex-column tw-w-full center mw8 pt1">
        <h1 className="michroma tracked lh-title white ttc f3 f2-ns pr4 mb3 mw6 mt1">
          Dashboard
        </h1>
        <div className="mb3">
          <p className="sticky top-from-nav z-1 bg-black michroma f8 tracked-1 ttu lh-title yellow pv2 bb">
            Active/Upcoming Reservations
          </p>
          {allActiveReservations()}
        </div>
        <div className="mb3">
          <p className="sticky top-from-nav z-1 bg-black michroma f8 tracked-1 ttu lh-title yellow pv2 bb">
            Past Reservations
          </p>
          {allPastReservations()}
        </div>
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
