import React, { Component } from "react";

export default class SettingUpVenueScreen extends Component {
  componentDidMount() {
    const { location, history, venueAgent } = this.props;
    const { state: locationState } = location;
    venueAgent
      .completeStripeFlow(`${location.pathname}${location.search}`)
      .then(resp => {
        if (locationState) {
          history.replace(locationState.from);
        } else {
          history.replace("/dashboard");
        }
      })
      .catch(error => {
        console.log("there was an issue with setting up your account", error);
        // TODO: do something here, either retry, log it, and redirect to dashboard to allow user
        // to retry manually
      });
  }
  render() {
    return (
      <div className="tw-flex tw-self-center tw-mx-auto">
        <p className="michroma tw-text-md tracked tw-text-center tw-text-white tw--mt-56">
          Setting up your Vippy account...
          <br />
          <br />
          One moment
        </p>
      </div>
    );
  }
}
