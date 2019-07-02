import React, { Component, Fragment } from "react";

import tableImage from "../images/table.png";

class DetailedListing extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // fetch listing data
  }
  render() {
    return (
      <div className="pt4 mw8 center">
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
                backgroundSize: "contain",
                backgroundImage: `url(${``})`
              }}
              className="dim aspect-ratio aspect-ratio--1x1 bg-vippy-1"
            />
          </div>
          <div className="w-third w-25-l mr2">
            <div
              style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundImage: `url(${``})`
              }}
              className="dim aspect-ratio aspect-ratio--1x1 bg-vippy-1"
            />
          </div>
          <div className="w-third w-25-l mr2">
            <div
              style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundImage: `url(${``})`
              }}
              className="dim aspect-ratio aspect-ratio--1x1 bg-vippy-1"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DetailedListing;
