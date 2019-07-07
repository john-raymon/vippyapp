import React, { Component, Fragment } from "react";
import ListingLineItem from "./ListingLineItem";
import ReservationForm from "./ReservationForm";
import { Elements, StripeProvider } from "react-stripe-elements";

export default class Checkout extends Component {
  constructor(props) {
    super(props);
    this.handleReservationFormSubmit = this.handleReservationFormSubmit.bind(
      this
    );
    this.state = {
      listing: null,
      error: null,
      formError: null,
      loading: false
    };
  }
  componentDidMount() {
    if (
      this.props.location.state &&
      this.props.location.state.continueCheckout
    ) {
      this.props.userAgent
        ._get(`api/listing/${this.props.location.state.listingId}`)
        .then(resp => {
          this.setState({
            listing: resp.listing,
            stripeToken: JSON.parse(
              this.props.location.state.stripeTokenObject
            ),
            error: null
          });
        })
        .catch(error => {
          this.setState({
            error: "Sorry, we can't load the listing right now."
          });
        });
    } else {
      return this.props.history.push({
        pathname: "/"
      });
    }
  }
  handleReservationFormSubmit(stripeObject) {
    // attempt to validate, and get token then worry about checking authentication.
    this.setState({
      formError: null
    });
    stripeObject.createToken().then(res => {
      if (res.error) {
        return this.setState({
          formError: res.error,
          loading: false
        });
      }
      if (res.token) {
        return this.setState({
          loading: false
        });
      }
    });
  }
  render() {
    const { listing, formError } = this.state;
    const { userAgent } = this.props;
    console.log("the error", formError);
    if (listing) {
      return (
        <StripeProvider apiKey="pk_test_2Txz4BEB02STeZraf70NgKYh">
          <div className="flex flex-column mw8 center">
            <h1 className="michroma white tracked lh-copy mb4">Checkout</h1>
            <div className="flex flex-column flex-row-l">
              <div className="w-100 w-50-l">
                {listing && (
                  <ListingLineItem
                    boxTitle="You're almost done! Read the details of your reservation below."
                    listing={listing}
                    userAgent={userAgent}
                  />
                )}
              </div>
              <div className="flex flex-column w-100 w-50-l">
                <div className="ReservationForm__container flex flex-column justify-center flex-grow-1 bg-vippy-1 w-100 mv2 mh2-l mv0-l br2 bg-black">
                  <Elements>
                    <ReservationForm
                      formError={formError}
                      handleSubmit={this.handleReservationFormSubmit}
                      guestCount={listing.guestCount}
                      bookingPrice={listing.bookingPrice}
                      disclaimers={listing.disclaimers}
                      cardElementWrapperWidthClass="w-100"
                      disclaimersWrapperWidthClass="w-100"
                      cardElementParentContainerClasses="flex flex-column w-90"
                    />
                  </Elements>
                </div>
              </div>
            </div>
          </div>
        </StripeProvider>
      );
    }
    return <p className="white"> Loading Checkout ... </p>;
  }
}
