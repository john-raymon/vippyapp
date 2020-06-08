import React, { Component, Fragment } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import { PreviewEventCard } from "./Cards";
import { Calendar } from "react-date-range";
import { StaticGoogleMap, Marker, Path } from "react-static-google-map";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import VippyLogo from "../svgs/logo";
import * as yup from "yup";
import {
  phoneNumber as phoneNumberRegExp,
  password as passwordRegExp,
  zipCode as zipCodeRegExp
} from "./../utils/regExp";

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

export default class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      initialRootVariant: "hidden",
      event: null
    };
  }

  componentDidMount() {
    this.setState({ initialRootVariant: "visible" });
    if (this.props.match.params["eventId"]) {
      // fetch event
      this.props.venueAgent
        .getEventById(this.props.match.params["eventId"])
        .then(resp => {
          return this.setState({
            event: resp.event
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
