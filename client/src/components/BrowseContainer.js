import React, { Component } from "react";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

class BrowseContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: "events",
      tabs: ["events", "listings"]
    };
  }
  render() {
    return <div className="bg-grey h-4 w-100" />;
  }
}

export default BrowseContainer;
