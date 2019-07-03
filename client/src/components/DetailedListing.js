import React, { Component, Fragment } from "react";
import { EventCard } from "./Cards";
import tableImage from "../images/table.png";

class DetailedListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: null,
      error: null
    };
  }
  componentDidMount() {
    // fetch listing data
    this.props.userAgent
      ._get(`api/listing/${this.props.match.params.listingId}`)
      .then(resp => {
        this.setState({
          listing: resp.listing,
          error: null
        });
      })
      .catch(error => {
        this.setState({
          error: "Sorry, we can't load the listing right now."
        });
      });
  }
  render() {
    const { error, listing } = this.state;
    console.log(listing);
    if (error) {
      return <p className="red">{error}</p>;
    }
    if (listing) {
      const { event } = listing;
      const [
        [firstImageKey, firstImage = { url: "" }] = [],
        [secondImageKey, secondImage = { url: "" }] = [],
        [thirdImageKey, thirdImage = { url: "" }] = []
      ] = Object.entries(listing.images);
      return (
        <div className="pv4 mw8 center white">
          <div className="flex flex-row items-end w-100">
            <div className="w-third w-25-l mr2">
              <img
                src={tableImage}
                width="100%"
                alt="Hero Background"
                className="pn1"
              />
            </div>
            <div className="w-third w-25-l mr2">
              <div
                style={{
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundImage: `url(${firstImage.url})`
                }}
                className="dim aspect-ratio aspect-ratio--1x1 bg-vippy-1"
              />
            </div>
            <div className="w-third w-25-l mr2">
              <div
                style={{
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundImage: `url(${secondImage.url})`
                }}
                className="dim aspect-ratio aspect-ratio--1x1 bg-vippy-1"
              />
            </div>
            <div className="w-third w-25-l mr2">
              <div
                style={{
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundImage: `url(${thirdImage.url})`
                }}
                className="dim aspect-ratio aspect-ratio--1x1 bg-vippy-1"
              />
            </div>
          </div>
          <div className="flex flex-column flex-row-ns w-100 pt2 justify-between">
            <div className="w-100 w-75-ns pr2">
              <h1 className="michroma tracked lh-title ttu">{listing.name}</h1>
              <p className="michroma f8 tracked lh-copy white-60 pb2 ttu tj">
                <span className="db vippy-yellow lh-title pb1">
                  disclaimers
                </span>
                {`${listing.disclaimers}`}
              </p>
              <p className="michroma f5 tracked lh-title yellow pb2 ttu tl">
                {`$${listing.bookingPrice} / up to ${listing.guestCount} guest`}
              </p>
            </div>
            <div className="w-100 w-25-ns pl2">
              <div>
                <EventCard
                  eventTitle={event.name}
                  venueInitial={event.host.venueName[0]}
                  eventDate={event.date}
                  eventStartTime={event.startTime}
                  eventEndTime={event.endTime}
                  venueName={event.host.venueName}
                  venueStreetAddress={event.address.street}
                  venueCityZipCode={`${event.address.city},${
                    event.address.state
                  } ${event.address.zip}`}
                  images={event.images}
                  widthClassName="w-100"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-column w-100">
            <h1 className="michroma tracked lh-title white mb2">
              Like this listing ?
            </h1>
            <p className="michroma f5 tracked b lh-copy white pa0 mb2">
              Specify the essentials you'd like, pay & reserve.
            </p>
            <div className="ReservationForm__container bg-vippy-1 w-100 h5 mv2">
              <form className="w-100">
                <div className="flex">
                  <input type="" />
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
    return <p>Loading</p>;
  }
}

export default DetailedListing;
