import React, { Component } from "react";
import tableImage from "../images/table.png";

export default class ListingImagesHeader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const [
      [firstImageKey, firstImage = { url: "" }] = [],
      [secondImageKey, secondImage = { url: "" }] = [],
      [thirdImageKey, thirdImage = { url: "" }] = []
    ] = Object.entries(this.props.listingImages);
    return (
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
    );
  }
}
