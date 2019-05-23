import React, { Fragment } from "react";
import { formatEventDate, formatEventTimes } from "./../utils/dateFns";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

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

// images
import eventIcon from "./../images/event-icon.png";

export function EventCard({
  venueInitial = "",
  eventTitle = "n/a",
  eventStartTime = "--:--",
  eventEndTime = "--:--",
  venueName = "n/a",
  venueStreetAddress = "n/a",
  venueCityZipCode = "n/a"
}) {
  const { startTime, endTime } = formatEventTimes(eventStartTime, eventEndTime);
  const eventStartDate = formatEventDate(eventStartTime);
  return (
    <div className="mv2 w-100 pb1 ph1">
      <Card className="flex flex-column">
        <CardHeader
          className="bg-vippy-2"
          avatar={
            <Avatar aria-label="Recipe" className="">
              {venueInitial}
            </Avatar>
          }
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={eventTitle}
          subheader={eventStartDate}
          titleTypographyProps={{
            className: "f7-important white-important"
          }}
          subheaderTypographyProps={{
            className: "f7-important white-wash-important"
          }}
        />
        <CardContent
          component="div"
          className="bg-vippy-2 padding-top-025-important"
        >
          <div className="flex flex-row flex-wrap flex-grow-0 mw6">
            <div className="flex flex-column flex-grow-1 self-end mb2">
              <div className="flex items-center flex-grow-1 justify-between ph1 mb1 white">
                <p className="michroma f8 b tracked ttu">Start Time:</p>
                <p className="michroma f8 ml1">{startTime}</p>
              </div>
              <div className="flex items-center flex-grow-1 justify-between ph1 mb1 white">
                <p className="michroma f8 b tracked ttu">End Time:</p>
                <p className="michroma f8 ml1">{endTime}</p>
              </div>
            </div>
            <div className="flex flex-column white flex-grow-1 self-end tr">
              <p className="michroma f8 b tracked ttu mb1">{venueName}</p>
              <p className="michroma f8 b tracked ttu mb1">
                {venueStreetAddress}
              </p>
              <p className="michroma f8 b tracked ttu mb1">
                {venueCityZipCode}
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
            view event's packages
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export function ListingCard({
  packageTitle = "n/a",
  eventDate = "n/a",
  eventStartTime = "-:--",
  eventEndTime = "-:--",
  guestCount = "--",
  price = "--.--",
  venueName = "n/a",
  venueStreetAddress = "n/a",
  venueCityZipCode = "n/a",
  bookingDeadline = ""
}) {
  const formattedBookingDeadline = distanceInWordsToNow(
    new Date(bookingDeadline),
    {
      addSuffix: true,
      includeSeconds: true
    }
  );
  const { startTime, endTime } = formatEventTimes(eventStartTime, eventEndTime);
  const eventStartDate = formatEventDate(eventStartTime);
  return (
    <Fragment>
      <div className="mv2 w-100 pb1 ph1">
        <Card className="flex flex-column">
          <CardHeader
            className="bg-vippy-2"
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title={packageTitle}
            subheader={`at ${venueName} on ${eventStartDate}`}
            titleTypographyProps={{
              className: "f7-important white-important michroma-important"
            }}
            subheaderTypographyProps={{
              className: "f8-important white-wash-important michroma-important"
            }}
          />
          <CardContent
            component="div"
            className="padding-top-025-important bg-vippy-2"
          >
            <p className="flex w-100 pa1 michroma f8 b tracked ttu white mt1 mb3">
              Booking ends {formattedBookingDeadline}
            </p>
            <div className="flex flex-row flex-wrap flex-grow-0">
              <div className="flex pv1 pr1">
                <div className="flex items-center justify-between ph1 mb1 white">
                  <p className="michroma f8 b tracked ttu">Guest Count:</p>
                  <p className="michroma f8 ml1">{guestCount}</p>
                </div>
              </div>
              <div className="flex pv1 pr1">
                <div className="flex items-center justify-between ph1 mb1 white">
                  <p className="michroma f8 b tracked ttu">Price:</p>
                  <p className="michroma f8 ml1">${price}</p>
                </div>
              </div>
              <p className="flex w-100 pa1 michroma f8 b tracked ttu light-gray mt1 mb2 bg-black-10">
                this package's event info :
              </p>
              <div className="flex flex-column flex-grow-1 self-start mb2">
                <div className="flex items-center flex-grow-1 justify-between ph1 mb1 white">
                  <p className="michroma f8 b tracked ttu">Start Time:</p>
                  <p className="michroma f8 ml1">{startTime}</p>
                </div>
                <div className="flex items-center flex-grow-1 justify-between ph1 mb1 white">
                  <p className="michroma f8 b tracked ttu">End Time:</p>
                  <p className="michroma f8 ml1">{endTime}</p>
                </div>
              </div>
              <div className="flex flex-column white flex-grow-1 self-end tr">
                <p className="michroma f8 b tracked ttu mb1">{venueName}</p>
                <p className="michroma f8 b tracked ttu mb1">
                  {venueStreetAddress}
                </p>
                <p className="michroma f8 b tracked ttu mb1">
                  {venueCityZipCode}
                </p>
              </div>
              <p className="flex w-100 flex-row items-center michroma f8 b tracked ttu white pointer">
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
}
