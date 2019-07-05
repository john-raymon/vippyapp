import React, { Component, Fragment } from "react";
import {
  CardElement,
  Elements,
  injectStripe,
  StripeProvider
} from "react-stripe-elements";
import { EventCard } from "./Cards";
import tableImage from "../images/table.png";

// <form className="flex flex-column items-center pv4 w-100">
//   <div className="flex flex-column flex-row-ns w-90">
//     <div className="flex flex-column w-100 w-50-ns">
//       <input className="ReservationForm__input mb3" type="" placeholder="card number" />
//       <div className="flex flex-row flex-wrap">
//         <input className="ReservationForm__input flex flex-grow-1 mb2" type="" placeholder="EXP MM/YY" />
//         <input className="ReservationForm__input flex flex-grow-1 mb2" type="" placeholder="CVC" />
//       </div>
//     </div>
//     <div className="flex flex-column w-100 w-50-ns ph4-ns pt2">
//       <p className="michroma f8 tracked lh-copy white-60 pb2 ttu tj">
//         <span className="db vippy-yellow lh-title pb1">
//           disclaimers
//         </span>
//         {`${listing.disclaimers}`}
//       </p>
//     </div>
//   </div>
// </form>

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: "#ffffff",
        letterSpacing: "0.02em",
        fontFamily: "michromaregular, Source Code Pro, monospace",
        "::placeholder": {
          color: "#aab7c4"
        },
        padding
      },
      invalid: {
        color: "#9e2146"
      }
    }
  };
};

class _ReservationForm extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <form
        className="flex flex-column items-center pv4 w-100"
        onSubmit={e => {
          e.preventDefault();
          this.props.handleSubmit(this.props.stripe);
        }}
      >
        <div className="flex flex-column flex-row-ns w-90">
          <div className="flex flex-column w-100 w-50-ns justify-center pb3">
            <CardElement
              onReady={el =>
                setTimeout(() => {
                  el.focus();
                }, 2000)
              }
              {...createOptions("1.1rem")}
            />
          </div>
          <div className="flex flex-column w-100 w-50-ns ph4-ns pt2">
            <p className="michroma f8 tracked lh-copy white-60 pb2 ttu tj">
              <span className="db vippy-yellow lh-title pb1">disclaimers</span>
              {`${this.props.disclaimers}`}
            </p>
          </div>
        </div>

        <p className="michroma f5 tracked lh-title white pv3 ph1 ttu tc">
          {`Total: $${this.props.bookingPrice} / up to ${
            this.props.guestCount
          } guest`}
        </p>

        <button className="vippyButton mt3 mv3 mw1 center dim" type="submit">
          <div className="vippyButton__innerColorBlock">
            <div className="w-100 h-100 flex flex-column justify-center">
              <p className="michroma f8 tracked-1 b ttu lh-extra white-90 center pb1">
                purchase
              </p>
            </div>
          </div>
        </button>
      </form>
    );
  }
}
const ReservationForm = injectStripe(_ReservationForm);

class DetailedListing extends Component {
  constructor(props) {
    super(props);
    this.handleReservationFormSubmit = this.handleReservationFormSubmit.bind(
      this
    );
    this.state = {
      listing: null,
      error: null,
      formError: null
    };
  }
  componentDidMount() {
    console.log("the new state in location is", this.props.location.state);
    if (
      this.props.location.state &&
      this.props.location.state.continueCheckout
    ) {
      // no need to fetch listing data, as user will be forwarded to dedicated
      // checkout container component, which will handle everything with
      // stripe token data (this.props.location.state.stripeTokenObject) created from the user's card information and also this listing's id.
    } else {
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
  }
  handleReservationFormSubmit(stripeObject) {
    const { isAuth, history, location } = this.props;
    // attempt to validate, and get token then worry about checking authentication.
    stripeObject.createToken().then(res => {
      if (res.error) {
        return this.setState({
          formError: res.error
        });
      }
      if (res.token) {
        if (!isAuth) {
          return history.push({
            pathname: "/login",
            state: {
              from: {
                ...location,
                state: {
                  continueCheckout: true,
                  listingId: this.props.match.params.listingId,
                  stripeTokenObject: JSON.stringify(res.token)
                }
              }
            }
          });
        }
      }
    });
  }

  render() {
    const { error, listing, formError } = this.state;
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
        <StripeProvider apiKey="pk_test_2Txz4BEB02STeZraf70NgKYh">
          <Elements>
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
                <div className="w-100 w-75-l pr2">
                  <h1 className="michroma tracked lh-title ttu">
                    {listing.name}
                  </h1>
                  <p className="michroma f7 tracked lh-copy white-90 mt3 mb4 tl">
                    {listing.description}
                  </p>
                  <p className="michroma f8 tracked lh-copy white-60 pb2 ttu tj">
                    <span className="db vippy-yellow lh-title pb1">
                      disclaimers
                    </span>
                    {`${listing.disclaimers}`}
                  </p>
                  <p className="michroma f5 tracked lh-title yellow pb2 ttu tl">
                    {`$${listing.bookingPrice} / up to ${
                      listing.guestCount
                    } guest`}
                  </p>
                </div>
                <div className="w-100 w-25-l pl2">
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
                      aspectRatioClass="aspect-ratio--3x4"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-column w-100">
                <h1 className="michroma tracked lh-title white mb2">
                  Like this listing ?
                </h1>
                <p className="michroma f5 tracked b lh-copy white pa0 mb3">
                  Reserve below.
                </p>
                <div className="ReservationForm__container bg-vippy-1 w-100 mv2 br2">
                  <ReservationForm
                    handleSubmit={this.handleReservationFormSubmit}
                    formError={formError}
                    guestCount={listing.guestCount}
                    bookingPrice={listing.bookingPrice}
                    disclaimers={listing.disclaimers}
                  />
                </div>
              </div>
            </div>
          </Elements>
        </StripeProvider>
      );
    }
    return <p className="white">Loading</p>;
  }
}

export default DetailedListing;
