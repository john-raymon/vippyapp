import React, { Component, Fragment } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import { PreviewEventCard } from "./Cards";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";
import VippyLogo from "../svgs/logo";
import * as yup from "yup";

const SInputBase = withStyles(theme => ({
  input: {
    borderRadius: 4,
    color: theme.palette.grey[800],
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.grey[400]}`,
    fontSize: 16,
    padding: "1rem",
    "&:hover": {
      borderColor: "black",
      backgroundColor: theme.palette.background.paper
    },
    "&:focus": {
      borderRadius: 4,
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.primary.main
    }
  }
}))(InputBase);

export default class CreateListing extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.formatMilitaryTime = this.formatMilitaryTime.bind(this);
    this.handleBookingDeadlineTimeChange = this.handleBookingDeadlineTimeChange.bind(
      this
    );
    this.onSubmit = this.onSubmit.bind(this);
    this.validate = this.validate.bind(this);
    this.state = {
      initialRootVariant: "hidden",
      event: null,
      newListing: {
        name: "",
        description: "",
        bookingDeadline: new Date(),
        guestCount: 1,
        disclaimers: "",
        quantity: 1,
        unlimitedQuantity: false,
        bookingPrice: ""
      },
      timeSlots: [],
      bookingDeadlineTime: "0000"
    };
  }

  componentDidMount() {
    let militaryTime = [];
    for (let hourCount = 0, minCount = -30, totalTime = 0; totalTime < 2330; ) {
      hourCount = minCount === 30 ? hourCount + 1 : hourCount;
      minCount = minCount === 30 ? 0 : minCount + 30;
      totalTime = `${("0" + hourCount).slice(-2)}${("0" + minCount).slice(-2)}`;
      militaryTime = [...militaryTime, totalTime];
    }
    this.setState({ initialRootVariant: "visible", timeSlots: militaryTime });
    if (this.props.match.params["eventId"]) {
      // fetch event
      this.props.venueAgent
        .getEventById(this.props.match.params["eventId"])
        .then(resp => {
          const parsedEndTime =
            moment(resp.event.endTime).minute() === 30 ||
            moment(resp.event.endTime).minute() === 0
              ? moment(resp.event.endTime).subtract(30, "minutes")
              : moment(resp.event.endTime)
                  .set({ minute: 30 })
                  .subtract(30, "minutes");
          return this.setState({
            event: resp.event,
            newListing: {
              ...this.state.newListing,
              bookingDeadline: parsedEndTime
            },
            bookingDeadlineTime: parsedEndTime.format("kkmm")
          });
        })
        .catch(error => {
          this.setState({
            error:
              "There was an error locating the event. It may have been deleted or removed."
          });
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bookingDeadlineTime !== this.state.bookingDeadlineTime) {
      this.handleBookingDeadlineTimeChange();
    }
  }

  formatMilitaryTime(time) {
    return moment(time, "kkmm A").format("hh:mm A");
  }

  handleBookingDeadlineTimeChange(
    date = this.state.newListing.bookingDeadline
  ) {
    const endTimeHours = `${this.state.bookingDeadlineTime[0]}${
      this.state.bookingDeadlineTime[1]
    }`;
    const endTimeMinutes = `${this.state.bookingDeadlineTime[2]}${
      this.state.bookingDeadlineTime[3]
    }`;
    const bookingDeadline = moment(date)
      .startOf("day")
      .add(endTimeHours, "hours")
      .add(endTimeMinutes, "minutes")
      .format();
    this.setState({
      newListing: { ...this.state.newListing, bookingDeadline }
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.validate(this.state.newListing)
      .then(validatedListing => {
        console.log("validated with", validatedListing);
        const body = {
          ...validatedListing,
          eventId: this.state.event.id
        };
        this.props.venueAgent
          .createListing(body)
          .then(() => {
            this.props
              .fetchListingsForVenueDispatch(
                this.props.venueAgent,
                this.props.venue.venueId
              )
              .catch(error => {
                throw { ...error, requestType: "api" };
              });
            this.props.history.push("/dashboard");
          })
          .catch(error => {
            throw { ...error, requestType: "api" };
          });
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  /**
   * validate the new event object using Yup; Object Schema Validation
   */

  validate(listing) {
    const listingSchema = yup.object().shape({
      name: yup.string().required("Create a title for your listing"),
      description: yup.string(),
      bookingDeadline: yup
        .date()
        .required("Please a booking deadline for this listing."),
      guestCount: yup
        .number()
        .min(1)
        .required(
          "You must provide the guest count for the listing to indicate how many individuals can enter the party by reserving this listing."
        ),
      disclaimers: yup.string().notRequired(),
      unlimitedQuantity: yup.boolean(),
      quantity: yup.number().when("unlimitedQuantity", {
        is: false, // alternatively: (val) => val == true
        then: yup
          .number()
          .min(1)
          .required(
            "If your listing's quantity is limited then you must provide a quantity of at least 1."
          ),
        otherwise: yup.number().notRequired()
      }),
      bookingPrice: yup
        .number()
        .transform(cv => (isNaN(cv) ? 0 : cv))
        .positive()
        .min(0)
    });
    return listingSchema.validate(listing, {
      abortEarly: false
    });
  }

  render() {
    const rootVariants = {
      visible: {
        y: 0,
        transition: { duration: 0.15 }
      },
      hidden: {
        y: "200%"
      }
    };
    const { event, errors } = this.state;
    return (
      <Fragment>
        <button
          aria-label="Close"
          onClick={() => this.props.history.goBack()}
          className="tw-fixed tw-bg-black tw-h-screen tw-w-full tw-z-50 tw-top-0 tw-left-0 tw-opacity-75"
        />
        <motion.div
          initial="hidden"
          animate={this.state.initialRootVariant}
          variants={rootVariants}
          ref={this.containerRef}
          className="create-listings tw-fixed tw-bottom-0 tw-right-0 tw-w-full tw-h-full tw-z-50 tw-bg-white tw-overflow-y-scroll"
        >
          <div className="create-listings__inner-container tw-relative">
            <div className="tw-sticky tw-top-0 tw-w-full tw-bg-white tw-z-40 tw-shadow-2xl">
              <div className="tw-sticky tw-flex tw-items-center tw-justify-between tw-w-full tw-top-0 tw-right-0 tw-p-2 tw-bg-black md:tw-px-10 lg:tw-px-20">
                <div className="tw-w-20 tw-fill-current tw-text-black">
                  <VippyLogo />
                </div>
                <div className="tw-flex tw-items-center tw-justify-start tw-flex-grow tw-pl-2">
                  <p className="tw-text-2xs tw-text-gray-200 tw-opacity-75 ttw-text-left tw-font-black tw-normal-case tw-tracking-wider tw-leading-snug">
                    Add tables & packages to your event
                  </p>
                </div>
                <button
                  onClick={() => this.props.history.goBack()}
                  className="tw-w-10 tw-h-10 tw-flex tw-fill-current tw-text-white tw-right-0"
                >
                  <svg width="100%" height="100%" viewBox="0 0 512 512">
                    <path d="m278.6 256 68.2-68.2c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-68.2 68.2-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3s1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3s1.6 8.2 4.7 11.3c6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="tw-relative tw-flex tw-flex-col lg:tw-flex-row tw-mx-auto tw-max-w-6xl">
              <div className="tw-flex tw-sticky _top-14 tw-justify-start tw-items-start tw-w-full md:tw-w-3/5 tw-z-30 tw-bg-white tw-px-3 tw-shadow-xl lg:tw-shadow-none">
                <div className="tw-sticky tw-top-0 tw-flex tw-flex-col tw-items-center tw-w-full sm:tw-w-3/5 lg:tw-w-full tw-mx-auto tw-py-3 lg:tw-pt-20">
                  {event && (
                    <Fragment>
                      {(this.props.match.params["new"] || "") && (
                        <p className="tw-text-xs tw-text-black  tw-mb-2 tw-border-b tw-border-gray-300 self-start tw-bg-green-500 tw-w-full tw-text-gray-200 tw-p-3">
                          Add tables & packages for your new event
                        </p>
                      )}
                      <PreviewEventCard
                        venueName={event.venueName || "venue name"}
                        eventOrganizer={event.organizer}
                        eventTitle={event.name || "event title"}
                        eventStartTime={event.startTime}
                        eventEndTime={event.endTime}
                        newRootClasses="tw-w-full tw-flex-shrink"
                        newInnerContainerClasses="tw-flex tw-flex-row tw-justify-end tw-items-start tw-self-stretch"
                        textColor="black"
                      />
                    </Fragment>
                  )}
                </div>
              </div>
              <div className="tw-flex tw-flex-col tw-px-4 lg:tw-px-2 tw-pt-8 lg:tw-pt-12 tw-w-full tw-flex-grow">
                <section className="tw-mb-4 tw-border-b tw-border-gray-400 tw-pb-4">
                  <p className="tw-text-xs tw-tracking-wider tw-p-6 tw-bg-gray-300 tw-text-gray-700 tw-w-full">
                    Create a new VIP/Package
                  </p>
                  <form onSubmit={this.onSubmit}>
                    <section className="tw-flex tw-flex-wrap tw-w-full md:tw-mt-2 tw-border-b tw-border-gray-200 tw-py-2 md:tw-py-8">
                      <div className="tw-sticky tw-top-0 tw-flex tw-items-start tw-w-full md:tw-w-1/5 md:tw-border-r tw-border-gray-300 tw-py-4 md:tw-pr-6">
                        <p className="tw-font-mich tw-w-full tw-text-center md:tw-text-left tw-text-sm tw-text-gray-800 tw-tracking-wider tw-leading-relaxed tw-normal-case">
                          Basic Information
                        </p>
                      </div>
                      <div className="tw-flex tw-flex-col tw-flex-grow md:tw-pl-4">
                        <div className="tw-flex-row tw-flex-wrap">
                          <TextField
                            className="tw-w-full tw-my-1 md:tw-w-1/2 md:tw-pr-4"
                            label="Listing Title"
                            variant="outlined"
                            onChange={e =>
                              this.setState({
                                newListing: {
                                  ...this.state.newListing,
                                  name: e.target.value
                                }
                              })
                            }
                            value={this.state.newListing.name}
                          />
                          <TextField
                            className="tw-w-full tw-my-1 md:tw-w-1/2"
                            label="Short Listing Description"
                            variant="outlined"
                            onChange={e =>
                              this.setState({
                                newListing: {
                                  ...this.state.newListing,
                                  description: e.target.value
                                }
                              })
                            }
                            value={this.state.newListing.description}
                          />
                        </div>
                      </div>
                    </section>
                    <section className="tw-flex tw-flex-wrap tw-w-full md:tw-mt-2 tw-border-b tw-border-gray-200 tw-py-2 md:tw-py-8">
                      <div className="tw-sticky tw-top-0 tw-flex tw-items-start tw-w-full md:tw-w-1/5 md:tw-border-r tw-border-gray-300 tw-py-4 md:tw-pr-6">
                        <p className="tw-font-mich tw-w-full tw-text-center md:tw-text-left tw-text-sm tw-text-gray-800 tw-tracking-wider tw-leading-relaxed tw-normal-case">
                          Booking Details
                        </p>
                      </div>
                      <div className="dtw-flex tw-flex-col tw-flex-grow md:tw-pl-4">
                        <div className="tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-center tw-mt-4">
                          <div className="tw-flex tw-flex-col tw-justify-between tw-w-2/3 tw-items-center">
                            <p className="tw-font-mich tw-w-full tw-pb-2 tw-text-left tw-text-sm tw-text-gray-600 tw-tracking-wider tw-leading-relaxed tw-normal-case">
                              Booking deadline time*
                              <span className="tw-block tw-text-xs tw-text-gray-500">
                                (Must be at least 30 minutes before your event's
                                end time.)
                              </span>
                            </p>
                            <FormControl
                              variant="outlined"
                              className="tw-w-full"
                            >
                              <Select
                                onChange={e =>
                                  this.setState({
                                    bookingDeadlineTime: e.target.value
                                  })
                                }
                                value={this.state.bookingDeadlineTime}
                                input={<SInputBase />}
                              >
                                {this.state.timeSlots.map(time => {
                                  return (
                                    <MenuItem key={time} value={time}>
                                      {this.formatMilitaryTime(time)}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className="tw-flex tw-flex-wrap tw-w-full md:tw-mt-2 tw-border-b tw-border-gray-200 tw-py-2 md:tw-py-8">
                      <div className="tw-sticky tw-top-0 tw-flex tw-items-start tw-w-full md:tw-w-1/5 md:tw-border-r tw-border-gray-300 tw-py-4 md:tw-pr-6">
                        <p className="tw-font-mich tw-w-full tw-text-center md:tw-text-left tw-text-sm tw-text-gray-800 tw-tracking-wider tw-leading-relaxed tw-normal-case">
                          Guest Count & Quantity
                        </p>
                      </div>
                      <div className="tw-flex tw-items-stretch tw-w-full md:tw-w-4/5 md:tw-pl-4">
                        <div className="tw-flex tw-flex-col tw-flex-grow tw-mx-2">
                          <TextField
                            className="tw-flex-grow"
                            type="number"
                            variant="outlined"
                            label="Guest Count"
                            onChange={e =>
                              this.setState({
                                newListing: {
                                  ...this.state.newListing,
                                  guestCount: e.target.value
                                }
                              })
                            }
                            value={this.state.newListing.guestCount}
                          />
                        </div>
                        <div className="tw-flex tw-flex-col tw-flex-grow tw-mx-2">
                          <TextField
                            className="tw-w-full tw-mb-2"
                            type="number"
                            variant="outlined"
                            label="Quantity"
                            disabled={this.state.newListing.unlimitedQuantity}
                            onChange={e =>
                              this.setState({
                                newListing: {
                                  ...this.state.newListing,
                                  quantity: e.target.value
                                }
                              })
                            }
                            value={this.state.newListing.quantity}
                          />
                          <label>
                            <input
                              type="checkbox"
                              name="unlimitedQuantity"
                              checked={this.state.newListing.unlimitedQuantity}
                              onChange={event => {
                                this.setState({
                                  newListing: {
                                    ...this.state.newListing,
                                    unlimitedQuantity: event.target.checked
                                  }
                                });
                              }}
                            />
                            <span className="tw-font-mich tw-text-xs tw-pl-2">
                              Has unlimimited quantity
                            </span>
                          </label>
                        </div>
                      </div>
                    </section>
                    <section className="tw-flex tw-flex-wrap tw-w-full md:tw-mt-2 tw-border-b tw-border-gray-200 tw-py-2 md:tw-py-8">
                      <div className="tw-sticky tw-top-0 tw-flex tw-items-start tw-w-full md:tw-w-1/5 md:tw-border-r tw-border-gray-300 tw-py-4 md:tw-pr-6">
                        <p className="tw-font-mich tw-w-full tw-text-center md:tw-text-left tw-text-sm tw-text-gray-800 tw-tracking-wider tw-leading-relaxed tw-normal-case">
                          Disclaimers
                        </p>
                      </div>
                      <div className="tw-flex tw-flex-col tw-flex-grow md:tw-pl-4">
                        <TextField
                          className="tw-mx-2 tw-flex-grow"
                          type="text"
                          variant="outlined"
                          label="Disclaimers"
                          placeholder="Legal Disclaimers"
                          onChange={e =>
                            this.setState({
                              newListing: {
                                ...this.state.newListing,
                                disclaimers: e.target.value
                              }
                            })
                          }
                          value={this.state.newListing.disclaimers}
                        />
                      </div>
                    </section>
                    <section className="tw-flex tw-flex-wrap tw-w-full md:tw-mt-2 tw-border-b tw-border-gray-200 tw-py-2 md:tw-py-8">
                      <div className="tw-sticky tw-top-0 tw-flex tw-items-start tw-w-full md:tw-w-1/5 md:tw-border-r tw-border-gray-300 tw-py-4 md:tw-pr-6">
                        <p className="tw-font-mich tw-w-full tw-text-center md:tw-text-left tw-text-sm tw-text-gray-800 tw-tracking-wider tw-leading-relaxed tw-normal-case">
                          Booking Price
                        </p>
                      </div>
                      <div className="tw-flex tw-flex-col tw-flex-grow tw-w-1/5 md:tw-pl-4">
                        <div className="tw-flex tw-pb-2">
                          <span className="tw-font-mich tw-text-green-500 tw-text-xs tw-self-center tw-pr-2">
                            USD $
                          </span>
                          <TextField
                            name="bookingPrice"
                            className="tw-flex-grow"
                            type="number"
                            variant="outlined"
                            label="Booking Price"
                            placeholder="Amount to sell"
                            onChange={e =>
                              this.setState({
                                newListing: {
                                  ...this.state.newListing,
                                  bookingPrice: e.target.value
                                }
                              })
                            }
                            value={this.state.newListing.bookingPrice}
                          />
                        </div>
                        <span className="tw-block tw-font-mich tw-text-center tw-text-xs tw-w-full tw-text-gray-600 tw-leading-relaxed tw-tracking-normal">
                          Vippy collects a 20 percent platform fee from every
                          redeemed transaction greater than USD $5.
                        </span>
                      </div>
                    </section>
                    <div class="tw-flex tw-flex-row tw-space-x-2 tw-justify-between tw-pt-4">
                      <button className="button tw-flex tw-font-mich tw-uppercase tw-bg-red-500 tw-w-auto tw-p-4 tw-rounded-lg tw-text-xs tw-tracking-widest-1 tw-font-extrabold tw-text-white">
                        Cancel
                      </button>
                      <button className="button tw-flex tw-font-mich tw-uppercase tw-bg-green-700 tw-w-auto tw-p-4 tw-rounded-lg tw-text-xs tw-tracking-widest-1 tw-font-extrabold tw-text-white">
                        Create Listing
                      </button>
                    </div>
                  </form>
                </section>
                <section className="tw-w-full">
                  <p className="tw-text-xs tw-tracking-wider tw-p-6 tw-bg-gray-300 tw-text-gray-700 tw-w-full">
                    Current VIP/Packges
                  </p>
                  <p className="tw-text-xs tw-tracking-widest tw-leading-loose tw-p-4 tw-text-center tw-text-gray-700 tw-w-full">
                    This event has no vip/packages.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </motion.div>
      </Fragment>
    );
  }
}
