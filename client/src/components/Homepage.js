import React, { Component } from "react";
import { connect } from "react-redux";
import { Route } from "react-router";

// mui components
import TextField from "@material-ui/core/TextField";

// images
import heroBackgroundImage from "./../images/vippy-hero-background.png";

class Homepage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="homepage flex mw8 center justify-center">
        <div className="homepage__hero flex flex-column">
          <p className="michroma f7 f6-l tracked-1 b lh-extra white-90 pt1 w-90 w-80-m w-60-l nb4 nb3-m nb2-l z-1">
            Book the best vip spot for your night out.
          </p>
          <div className="mw6">
            <img src={heroBackgroundImage} width="100%" />
          </div>
          <div className="flex flex-column w-auto mw5 self-end nt5">
            <div className="w-auto">
              <TextField
                label="search by zipcode"
                placeholder="ex. 55333"
                margin="normal"
                fullWidth="true"
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
            <div className="vippyButton mt2 mw1 self-end">
              <div className="vippyButton__innerColorBlock">
                <div className="w-100 h-100 flex flex-column justify-center">
                  <p className="michroma f8 f7-l tracked-1 b ttu lh-extra white-90 center pb1">
                    search
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
