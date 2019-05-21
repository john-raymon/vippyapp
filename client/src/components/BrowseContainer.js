import React, { Component, Fragment } from "react";

// components
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
import CircularProgress from "@material-ui/core/CircularProgress";
import { EventCard, ListingCard } from "./Cards";

// images
import eventIcon from "./../images/event-icon.png";

class BrowseContainer extends Component {
  constructor(props) {
    super(props);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.state = {
      currentTab: "events",
      tabs: ["events", "vips/packages"]
    };
  }

  handleTabChange(e, value) {
    this.setState({
      ...this.state,
      currentTab: value
    });
  }

  render() {
    const { currentTab, tabs } = this.state;
    const {
      events,
      listings,
      eventsCount,
      listingsCount,
      isLoading
    } = this.props;

    const eventsTabContent = () => {
      if (events !== null && events.length === 0) {
        return (
          <a
            href={`mailto:?subject=${encodeURIComponent(
              "GetVippy.com City Request"
            )}&body=${encodeURIComponent(
              "Hello, I would love for Vippy to expand near my city ... "
            )}`}
            className="michroma f7 tracked lh-extra white-90 pv2 ph3 tl no-underline"
          >
            Looks like we havn't expanded to your area yet. Try a different zip
            code, or advocate for it by reaching out{" "}
            <span className="underline">here</span>.
          </a>
        );
      }
      return events.map((event, key) => {
        return <EventCard key={key} />;
      });
      // return (
      //   <div className="mv2 w-100 pb1 ph1">
      //     <Card className="flex flex-column">
      //       <CardHeader
      //         className="bg-mid-gray"
      //         avatar={
      //           <Avatar aria-label="Recipe" className="">
      //             R
      //           </Avatar>
      //         }
      //         action={
      //           <IconButton>
      //             <MoreVertIcon />
      //           </IconButton>
      //         }
      //         title="DJ KHALED AT TIER - Ladies in Free"
      //         subheader="June 1, 2019"
      //         titleTypographyProps={{
      //           className: "f7-important white-important"
      //         }}
      //         subheaderTypographyProps={{
      //           className: "f7-important white-wash-important"
      //         }}
      //       />
      //       <CardContent
      //         component="div"
      //         className="bg-mid-gray padding-top-025-important"
      //       >
      //         <div className="flex flex-row flex-wrap flex-grow-0 mw6">
      //           <div className="flex flex-column flex-grow-1 self-start mb2">
      //             <div className="flex items-center flex-grow-1 justify-between ph1 mb1 white">
      //               <p className="michroma f8 b tracked ttu">Start Time:</p>
      //               <p className="michroma f8 ml1">8:00pm</p>
      //             </div>
      //             <div className="flex items-center flex-grow-1 justify-between ph1 mb1 white">
      //               <p className="michroma f8 b tracked ttu">End Time:</p>
      //               <p className="michroma f8 ml1">2:00am</p>
      //             </div>
      //           </div>
      //           <div className="flex flex-column white flex-grow-1 self-end tr">
      //             <p className="michroma f8 b tracked ttu mb1">
      //               Night Club Name
      //             </p>
      //             <p className="michroma f8 b tracked ttu mb1">123 Street</p>
      //             <p className="michroma f8 b tracked ttu mb1">
      //               Orlando, Fl 32825
      //             </p>
      //           </div>
      //         </div>
      //       </CardContent>
      //       <CardActionArea>
      //         <CardMedia
      //           className="aspect-ratio aspect-ratio--16x9"
      //           image="https://res.cloudinary.com/vippy/image/upload/v1558318218/vippy-event-images/nightclub-image_l5lcmq.jpg"
      //           title="Club Tier"
      //         />
      //       </CardActionArea>
      //       <CardActions className="bg-dark-gray">
      //         <Button
      //           size="small"
      //           color="primary"
      //           fullWidth
      //           className="michroma-important f8-important tracked"
      //         >
      //           view event's packages
      //         </Button>
      //       </CardActions>
      //     </Card>
      //   </div>
      // );
    };

    const listingsTabContent = () => {
      if (events !== null && events.length === 0) {
        return (
          <a
            href={`mailto:?subject=${encodeURIComponent(
              "GetVippy.com City Request"
            )}&body=${encodeURIComponent(
              "Hello, I would love for Vippy to expand near my city ... "
            )}`}
            className="michroma f7 tracked lh-extra white-90 pv2 ph3 tl no-underline"
          >
            Looks like we havn't expanded to your area yet. Try a different zip
            code, or advocate for it by reaching out{" "}
            <span className="underline">here</span>.
          </a>
        );
      }
      if (listings !== null && listings.length === 0) {
        return (
          <p className="michroma f7 tracked lh-extra white-90 pv2 ph3 tl">
            Looks like there aren't any listings near you.
          </p>
        );
      }

      return listings.map((listing, key) => {
        return <ListingCard key={key} />;
      });
      // return (
      //   <Fragment>
      //     <div className="mv2 w-100 pb1 ph1">
      //       <Card className="flex flex-column">
      //         <CardHeader
      //           className="bg-mid-gray"
      //           action={
      //             <IconButton>
      //               <MoreVertIcon />
      //             </IconButton>
      //           }
      //           title="Package - Pop Up"
      //           subheader="at Club Tier on June 1, 2019"
      //           titleTypographyProps={{
      //             className: "f7-important white-important"
      //           }}
      //           subheaderTypographyProps={{
      //             className: "f7-important white-wash-important"
      //           }}
      //         />
      //         <CardContent
      //           component="div"
      //           className="padding-top-025-important bg-mid-gray"
      //         >
      //           <div className="flex flex-row flex-wrap flex-grow-0">
      //             <div className="flex pv1 pr1">
      //               <div className="flex items-center justify-between ph1 mb1 white">
      //                 <p className="michroma f8 b tracked ttu">Guest Count:</p>
      //                 <p className="michroma f8 ml1">8</p>
      //               </div>
      //             </div>
      //             <div className="flex pv1 pr1">
      //               <div className="flex items-center justify-between ph1 mb1 white">
      //                 <p className="michroma f8 b tracked ttu">Price:</p>
      //                 <p className="michroma f8 ml1">$400.00</p>
      //               </div>
      //             </div>
      //             <p className="flex w-100 pa1 michroma f8 b tracked ttu light-gray mt1 mb2 bg-black-10">
      //               this package's event info :
      //             </p>
      //             <div className="flex flex-column flex-grow-1 self-start mb2">
      //               <div className="flex items-center flex-grow-1 justify-between ph1 mb1 white">
      //                 <p className="michroma f8 b tracked ttu">Start Time:</p>
      //                 <p className="michroma f8 ml1">8:00pm</p>
      //               </div>
      //               <div className="flex items-center flex-grow-1 justify-between ph1 mb1 white">
      //                 <p className="michroma f8 b tracked ttu">End Time:</p>
      //                 <p className="michroma f8 ml1">2:00am</p>
      //               </div>
      //             </div>
      //             <div className="flex flex-column white flex-grow-1 self-end tr">
      //               <p className="michroma f8 b tracked ttu mb1">
      //                 Night Club Name
      //               </p>
      //               <p className="michroma f8 b tracked ttu mb1">123 Street</p>
      //               <p className="michroma f8 b tracked ttu mb1">
      //                 Orlando, Fl 32825
      //               </p>
      //             </div>
      //             <p className="flex w-100 flex-row items-center michroma f8 b tracked ttu white pointer">
      //               <span className="w0 pr1">
      //                 <img src={eventIcon} width="100%" height="auto" />
      //               </span>
      //               view event
      //             </p>
      //           </div>
      //         </CardContent>
      //         <CardActionArea>
      //           <CardMedia
      //             className="w-100 h5"
      //             image="https://res.cloudinary.com/vippy/image/upload/v1558377293/vippy-event-images/IMG_0920_svg4mn.jpg"
      //             title="Club Tier"
      //           />
      //         </CardActionArea>
      //         <CardActions className="bg-dark-gray">
      //           <Button
      //             size="small"
      //             color="primary"
      //             fullWidth
      //             className="michroma-important f8-important tracked"
      //           >
      //             Reserve Now
      //           </Button>
      //         </CardActions>
      //       </Card>
      //     </div>
      //   </Fragment>
      // );
    };

    return (
      <div className="browseContainer w-100 w-50-l br2 self-end">
        {!listings || !events ? (
          <p className="michroma f7 tracked lh-extra white-90 pv2 ph3 tl">
            Enter your zip code above to browse nearby events and packages/vips.
          </p>
        ) : (
          <Fragment>
            <div className="flex flex-row items-center sticky top-from-nav mb2 z-5 bg-vippy-1">
              <Tabs
                value={currentTab}
                onChange={this.handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                className="flex-grow-1 bg-vippy-1"
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
              {isLoading ? (
                <p className="michroma f8 tracked lh-extra white-70 pv1 ph3 tc tr-m tc-l">
                  <CircularProgress color="primary" size="20px" />
                </p>
              ) : (
                <div className="flex-grow-1 h-100">
                  {currentTab === "events" && (
                    <p className="michroma f8 tracked lh-extra white-70 pv1 ph3 tc tr-m tc-l">
                      {`${eventsCount} nearby`}
                    </p>
                  )}
                  {currentTab === "vips/packages" && (
                    <p className="michroma f8 tracked lh-extra white-70 pv1 ph3 tc tr-m tc-l">
                      {`${listingsCount} nearby`}
                    </p>
                  )}
                </div>
              )}
            </div>
            {currentTab === "events" && (
              <div className="browseContainer__eventsTabContainer white flex flex-column">
                {!isLoading && eventsTabContent()}
              </div>
            )}
            {currentTab === "vips/packages" && (
              <div className="browseContainer__listingsTabContainer white flex flex-column">
                {!isLoading && listingsTabContent()}
              </div>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

export default BrowseContainer;
