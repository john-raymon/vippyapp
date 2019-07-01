import React, { Component } from "react";
import { connect } from "react-redux";

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
    const { activeReservationsCount, pastReservationsCount } = this.props;

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
          <p className="michroma f8 tracked lh-extra white-70 pv2 tl no-underline">
            You have {pastReservationsCount} past reservation
            {pastReservationsCount > 1 ? `s` : ""}.
          </p>
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
