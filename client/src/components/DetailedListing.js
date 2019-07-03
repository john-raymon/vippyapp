import React, { Component, Fragment } from "react";

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
      const [
        [firstImageKey, firstImage = { url: "" }] = [],
        [secondImageKey, secondImage = { url: "" }] = [],
        [thirdImageKey, thirdImage = { url: "" }] = []
      ] = Object.entries(listing.images);
      return (
        <div className="pt4 mw8 center white">
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
        </div>
      );
    }
    return <p>Loading</p>;
  }
}

export default DetailedListing;
