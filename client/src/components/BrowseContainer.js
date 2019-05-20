import React, { Component } from "react";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

class BrowseContainer extends Component {
  constructor(props) {
    super(props);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.state = {
      currentTab: "events",
      tabs: ["events", "listings"],
      listings: [],
      events: []
    };
  }

  handleTabChange(e, value) {
    this.setState({
      ...this.state,
      currentTab: value
    });
  }

  render() {
    const { currentTab, tabs, listings, events } = this.state;

    const eventsTabContent = () => {
      if (events.length === 0) {
        return (
          <p>
            Looks like we havn't expanded to your area yet. Advocate for it by
            reaching out here.
          </p>
        );
      }
    };

    const listingsTabContent = () => {
      if (events.length === 0) {
        return (
          <p>
            Looks like we havn't expanded to your area yet. Advocate for it by
            reaching out here.
          </p>
        );
      }
      if (listings.length === 0) {
        return <p>Looks like there aren't any listings near you.</p>;
      }
    };

    return (
      <div className="browserContainer bg-secondary w-100 br2 ph2">
        <Tabs
          value={currentTab}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColorInherit="primary"
          textColor="primary"
        >
          {tabs.map(tab => {
            return (
              <Tab
                value={tab}
                className="white-important ttu tr michroma-important f8-important right-0 relative-important lh-small tracked-05"
                label={tab}
                textColorInherit="primary"
                textColor="primary"
              />
            );
          })}
        </Tabs>
        {currentTab === "events" && (
          <div className="browserContainer__eventsTabContainer white">
            {eventsTabContent()}
          </div>
        )}
        {currentTab === "listings" && (
          <div className="browserContainer__listingsTabContainer white">
            {listingsTabContent()}
          </div>
        )}
      </div>
    );
  }
}

export default BrowseContainer;
