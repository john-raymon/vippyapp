import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { EventCard } from "./Cards";

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: "#ffffff",
        letterSpacing: "0.02em",
        fontFamily: "michromaregular, Source Code Pro, monospace",
        "::placeholder": {
          color: "#ffffff"
        },
        padding
      },
      invalid: {
        color: "#9e2146"
      }
    }
  };
};

class ReservationForm extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      cardElementWrapperWidthClass = "w-100 w-50-ns",
      disclaimersWrapperWidthClass = "w-100 w-50-ns",
      cardElementParentContainerClasses = "flex flex-column flex-row-ns w-90",
      formError
    } = this.props;
    return (
      <form
        className="flex flex-column items-center pv4 w-100"
        onSubmit={e => {
          e.preventDefault();
          this.props.handleSubmit(this.props.stripe);
        }}
      >
        {formError && (
          <p className="michroma f6 tracked ttc red lh-copy o-70 pt3 pb3">
            {formError.message}
          </p>
        )}
        <div className={`${cardElementParentContainerClasses}`}>
          <div
            className={`flex flex-column ${cardElementWrapperWidthClass} justify-center pb3`}
          >
            <CardElement
              onReady={el =>
                setTimeout(() => {
                  el.focus();
                }, 2000)
              }
              {...createOptions("13px")}
            />
          </div>
          <div
            className={`flex flex-column ${disclaimersWrapperWidthClass} ph4-ns pt2`}
          >
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
export default injectStripe(ReservationForm);
