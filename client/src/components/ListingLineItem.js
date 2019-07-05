import React, { Component, Fragment } from "react";
import { formatEventDate, formatEventTimes } from "./../utils/dateFns";
import { getFirstImageUrl } from "./Cards";

export default class ListingLineItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingListing: false,
      listing: null,
      error: null
    };
  }
  componentDidMount() {
    // fetch listing data
    this.props.userAgent
      ._get(`api/listing/${this.props.listingId}`)
      .then(resp => {
        this.setState({
          listing: resp.listing,
          error: null
        });
      })
      .catch(error => {
        // properly fall back to application wide error
        this.setState({
          error: "Sorry, we can't load the listing right now."
        });
      });
  }
  render() {
    const { fetchingListing, listing, error } = this.state;
    const {
      boxTitle = "Almost done! Sign in to your account before checking out and reserving"
    } = this.props;
    if (fetchingListing) {
      return <p className="white">Loading ...</p>;
    }
    if (error) {
      return (
        <p className="white">
          There was an error loading the listing you are trying to reserve.
          Please refresh the page and try again.
        </p>
      );
    }
    if (listing) {
      return (
        <div className="flex flex-column w-100 bg-white-90">
          <p className="michroma f5 lh-title yellow tracked bg-vippy-1 pa4 tc">
            {boxTitle}
          </p>
          <div className="flex flex-row w-100">
            <div className="flex flex-column justify-center w-30 pa3">
              <div
                style={{
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundImage: `url(${getFirstImageUrl(listing.images)})`
                }}
                className="aspect-ratio aspect-ratio--3x4 bg-white-10"
              />
            </div>
            <div className="flex flex-column w-70 items-end justify-center pa3 black">
              <p className="michroma f9 tracked lh-title pv2 ttu tr">
                {`@ ${listing.host.venueName}`}
              </p>
              <p className="michroma f6 tracked lh-title pb2 ttu tr">
                {`${listing.name}`}
              </p>
              <p className="michroma f8 tracked lh-title pb2 tr">
                {`${formatEventDate(listing.event.startTime)}`}
              </p>
              <p className="michroma f8 tracked lh-title pb2 tr">
                {`${formatEventTimes(listing.event.startTime).startTime} - ${
                  formatEventTimes(listing.event.endTime).endTime
                }`}
                <span className="pt2 db ttc tracked f9">* eastern time</span>
              </p>
              <p className="michroma f7 tracked lh-title pb2 ttu tr">
                {`$${listing.bookingPrice} / up to ${listing.guestCount} guest`}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return <p className="white">Loading</p>;
  }
}
