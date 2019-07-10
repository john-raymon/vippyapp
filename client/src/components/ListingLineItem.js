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
    if (!this.props.listing) {
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
    } else {
      this.setState({
        listing: this.props.listing
      });
    }
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
      const { startTime, endTime } = formatEventTimes(
        listing.event.startTime,
        listing.event.endTime
      );
      const eventStartDate = formatEventDate(listing.event.startTime);
      const { city, state, street, zip } = listing.event.address;
      return (
        <div className="flex flex-column w-100">
          <div className="flex flex-column w-100 bg-white">
            <p className="michroma f5 lh-title yellow tracked bg-vippy-1 ph4 pv3 tc break-word">
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
                  {`${eventStartDate}`}
                </p>
                <p className="michroma f8 tracked lh-title pb2 tr">
                  {`${startTime} - ${endTime}`}
                  <span className="pt2 db ttc tracked f9">* eastern time</span>
                </p>
                <p className="michroma f7 tracked lh-title pb2 ttu tr">
                  {`$${listing.bookingPrice} / up to ${
                    listing.guestCount
                  } guest`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row w-100 bg-white mt2 justify-between pa3 items-center">
            <p className="michroma f7 black lh-title tracked">Location:</p>
            <p className="michroma f7 lh-copy tracked tr">
              {street}
              <br />
              {`${city}, ${state} ${zip}`}
            </p>
          </div>
          <div className="flex flex-row w-100 bg-white mt2 justify-between pa3 items-center">
            <p className="michroma f7 black lh-title tracked">Includes:</p>
            <p className="michroma f8 lh-copy tracked pl2 tr">
              {listing.description}
            </p>
          </div>
          <div className="flex flex-row w-100 bg-white mt2 justify-between pa3 items-center">
            <p className="michroma f7 black lh-title tracked">Disclaimers:</p>
            <p className="michroma f8 lh-copy tracked pl2 tr">
              {listing.disclaimers}
            </p>
          </div>
        </div>
      );
    }
    return <p className="white">Loading</p>;
  }
}
