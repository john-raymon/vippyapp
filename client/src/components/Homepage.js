import React, { Component } from "react";
import { connect } from "react-redux";
// import { Route } from "react-router";

// redux actions
import { queryByZipCode } from "./../state/actions/queriedActions";

// mui components
import TextField from "@material-ui/core/TextField";
import BrowseContainer from "./BrowseContainer";

// images
import heroBackgroundImage from "./../images/vippy-hero-background.png";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.handleZipCodeChange = this.handleZipCodeChange.bind(this);
    this.onZipCodeSearchClick = this.onZipCodeSearchClick.bind(this);
    this.validateSearch = this.validateSearch.bind(this);
    this.state = {
      zipCode: ""
    };
  }

  handleZipCodeChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  validateSearch(zipCode = "") {
    let isError = false;
    if (!zipCode.trim()) {
      isError = true;
    }
    return isError;
  }

  onZipCodeSearchClick() {
    // validate
    const isError = this.validateSearch(this.state.zipCode);
    if (!isError) {
      this.props.queryByZipCode(this.state.zipCode);
    }
  }

  render() {
    const { zipCode } = this.state;
    const {
      isBrowserLoading,
      eventsCount,
      events,
      listingsCount,
      listings,
      browseError
    } = this.props;
    return (
      <div className="homepage flex flex-column mw8 center justify-center pb4">
        <div className="homepage__hero flex flex-column">
          <p className="michroma f6 tracked b lh-extra white-90 pt1 w-90 w-80-m w-60-l nb4 nb3-m nb2-l z-1 pl1">
            Book the best vip spot for your night out.
          </p>
          <div className="mw6">
            <img src={heroBackgroundImage} width="100%" alt="Hero Background" />
          </div>
          <div className="flex flex-column w-auto mw5 self-end nt5 mr2">
            <div className="w-auto">
              <TextField
                onChange={this.handleZipCodeChange}
                value={zipCode}
                name="zipCode"
                type="search"
                label="search by zip code"
                placeholder="ex. 55333"
                margin="normal"
                fullWidth={true}
                inputProps={{
                  className: "b--white tr w-70 f8-important tracked"
                }}
                InputProps={{
                  className:
                    "white-important w-100 tr b--white ttu michroma-important mt2-important tracked"
                }}
                InputLabelProps={{
                  className:
                    "white-important ttu tr michroma-important f8-important right-0 relative-important lh-small tracked-05"
                }}
              />
            </div>
            <button
              className="vippyButton mt2 mw1 self-end"
              onClick={this.onZipCodeSearchClick}
            >
              <div className="vippyButton__innerColorBlock">
                <div className="w-100 h-100 flex flex-column justify-center">
                  <p className="michroma f8 tracked-1 b ttu lh-extra white-90 center pb1">
                    search
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="homepage__browseContainerWrapper mt5 flex flex-column">
          <BrowseContainer
            isLoading={isBrowserLoading}
            events={events}
            listings={listings}
            eventsCount={eventsCount}
            listingsCount={listingsCount}
            error={browseError}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  queried: { isLoading, eventsCount, events, listingsCount, listings, error }
}) => {
  return {
    isBrowserLoading: isLoading,
    eventsCount,
    events,
    listingsCount,
    listings,
    browseError: error
  };
};

export default connect(
  mapStateToProps,
  { queryByZipCode }
)(Homepage);
