import React, { Component } from "react";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CardMedia from "@material-ui/core/CardMedia";

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
      if (events.length !== 0) {
        return (
          <p>
            Looks like we havn't expanded to your area yet. Advocate for it by
            reaching out here.
          </p>
        );
      }
      return (
        <Card className="flex flex-column">
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className="">
                R
              </Avatar>
            }
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title="DJ KHALED AT TIER - Ladies in Free"
            subheader="June 1, 2019"
            titleTypographyProps={{ className: "f8-important" }}
            subheaderTypographyProps={{ className: "f8-important" }}
          />
          <CardMedia
            className="aspect-ratio aspect-ratio--16x9"
            image="https://res.cloudinary.com/vippy/image/upload/v1558318218/vippy-event-images/nightclub-image_l5lcmq.jpg"
            title="Club Tier"
          />
        </Card>
      );
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
          className="mb3"
        >
          {tabs.map(tab => {
            return (
              <Tab
                value={tab}
                className="white-important ttu tl michroma-important f8-important lh-small tracked"
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
