import React, { Component, Fragment } from "react";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

// images
import eventIcon from "./../images/event-icon.png";

class BrowseContainer extends Component {
  constructor(props) {
    super(props);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.state = {
      currentTab: "vips/packages",
      tabs: ["events", "vips/packages"],
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
        <div className="mv2 w-100 pb1 ph1">
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
              titleTypographyProps={{ className: "f7-important" }}
              subheaderTypographyProps={{ className: "f7-important" }}
            />
            <CardContent component="div">
              <div className="flex flex-row flex-wrap flex-grow-0 mw6">
                <div className="flex flex-column flex-grow-1 self-start mb2">
                  <div className="flex items-center flex-grow-1 justify-between ph1 mb1">
                    <p className="michroma f8 b tracked black ttu">
                      Start Time:
                    </p>
                    <p className="michroma f8 mid-gray ml1">8:00pm</p>
                  </div>
                  <div className="flex items-center flex-grow-1 justify-between ph1 mb1">
                    <p className="michroma f8 b tracked ttu black">End Time:</p>
                    <p className="michroma mid-gray f8 ml1">2:00am</p>
                  </div>
                </div>
                <div className="flex flex-column mid-gray flex-grow-1 self-end tr">
                  <p className="michroma f8 b tracked ttu mb1">
                    Night Club Name
                  </p>
                  <p className="michroma f8 b tracked ttu mb1">123 Street</p>
                  <p className="michroma f8 b tracked ttu mb1">
                    Orlando, Fl 32825
                  </p>
                </div>
              </div>
            </CardContent>
            <CardActionArea>
              <CardMedia
                className="aspect-ratio aspect-ratio--16x9"
                image="https://res.cloudinary.com/vippy/image/upload/v1558318218/vippy-event-images/nightclub-image_l5lcmq.jpg"
                title="Club Tier"
              />
            </CardActionArea>
            <CardActions className="bg-dark-gray">
              <Button
                size="small"
                color="primary"
                fullWidth
                className="michroma-important f8-important tracked"
              >
                View Event Packages
              </Button>
            </CardActions>
          </Card>
        </div>
      );
    };

    const listingsTabContent = () => {
      if (events.length !== 0) {
        return (
          <p>
            Looks like we havn't expanded to your area yet. Advocate for it by
            reaching out here.
          </p>
        );
      }
      if (listings.length !== 0) {
        return <p>Looks like there aren't any listings near you.</p>;
      }
      return (
        <Fragment>
          <div className="mv2 w-100 pb1 ph1">
            <Card className="flex flex-column">
              <CardHeader
                action={
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                }
                title="Package - Pop Up"
                subheader="at Club Tier on June 1, 2019"
                titleTypographyProps={{ className: "f7-important" }}
                subheaderTypographyProps={{ className: "f7-important" }}
              />
              <CardContent
                component="div"
                className="padding-top-025-important"
              >
                <div className="flex flex-row flex-wrap flex-grow-0">
                  <div className="flex pv1 pr1">
                    <div className="flex items-center justify-between ph1 mb1">
                      <p className="michroma f8 b tracked ttu black">
                        Guest Count:
                      </p>
                      <p className="michroma f8 ml1 mid-gray">8</p>
                    </div>
                  </div>
                  <div className="flex pv1 pr1">
                    <div className="flex items-center justify-between ph1 mb1">
                      <p className="michroma f8 b tracked ttu black">Price:</p>
                      <p className="michroma f8 ml1 mid-gray">$400.00</p>
                    </div>
                  </div>
                  <p className="flex w-100 pa1 michroma f8 b tracked ttu dark-gray mt1 mb2 bg-black-10">
                    this package's event info :
                  </p>
                  <div className="flex flex-column flex-grow-1 self-start mb2">
                    <div className="flex items-center flex-grow-1 justify-between ph1 mb1">
                      <p className="michroma f8 b tracked ttu black">
                        Start Time:
                      </p>
                      <p className="michroma f8 ml1 mid-gray">8:00pm</p>
                    </div>
                    <div className="flex items-center flex-grow-1 justify-between ph1 mb1">
                      <p className="michroma f8 b tracked ttu black">
                        End Time:
                      </p>
                      <p className="michroma f8 ml1 mid-gray">2:00am</p>
                    </div>
                  </div>
                  <div className="flex flex-column mid-gray flex-grow-1 self-end tr">
                    <p className="michroma f8 b tracked ttu mb1">
                      Night Club Name
                    </p>
                    <p className="michroma f8 b tracked ttu mb1">123 Street</p>
                    <p className="michroma f8 b tracked ttu mb1">
                      Orlando, Fl 32825
                    </p>
                  </div>
                  <p className="flex w-100 flex-row items-center michroma f8 b tracked ttu black pointer">
                    <span className="w0 pr1">
                      <img src={eventIcon} width="100%" height="auto" />
                    </span>
                    view event
                  </p>
                </div>
              </CardContent>
              <CardActionArea>
                <CardMedia
                  className="w-100 h5"
                  image="https://res.cloudinary.com/vippy/image/upload/v1558377293/vippy-event-images/IMG_0920_svg4mn.jpg"
                  title="Club Tier"
                />
              </CardActionArea>
              <CardActions className="bg-dark-gray">
                <Button
                  size="small"
                  color="primary"
                  fullWidth
                  className="michroma-important f8-important tracked"
                >
                  Reserve Now
                </Button>
              </CardActions>
            </Card>
          </div>
        </Fragment>
      );
    };

    return (
      <div className="browseContainer w-100 w-50-l br2 self-end">
        <Tabs
          value={currentTab}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          className="mb3 sticky top-0 bg-vippy-1 z-5"
        >
          {tabs.map((tab, key) => {
            return (
              <Tab
                value={tab}
                key={key}
                className="white-important ttu tl michroma-important f8-important lh-small tracked"
                label={tab}
                textColor="primary"
              />
            );
          })}
        </Tabs>
        {currentTab === "events" && (
          <div className="browseContainer__eventsTabContainer white flex flex-column">
            {eventsTabContent()}
          </div>
        )}
        {currentTab === "vips/packages" && (
          <div className="browseContainer__listingsTabContainer white flex flex-column">
            {listingsTabContent()}
          </div>
        )}
      </div>
    );
  }
}

export default BrowseContainer;
