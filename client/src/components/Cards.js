import React from "react";
import { Link } from "react-router-dom";
import { formatEventDate, formatEventTimes } from "./../utils/dateFns";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

export const getFirstImageUrl = images => {
  const allImages = Object.keys(images);
  return allImages.length > 0
    ? images[allImages[0]].url
    : "https://res.cloudinary.com/vippy/image/upload/v1558677868/vippy-event-images/banter-snaps-393010-unsplash_sqqv7z.jpg";
};

export function EventCard({
  venueInitial = "",
  eventTitle = "n/a",
  eventStartTime = "--:--",
  eventEndTime = "--:--",
  venueName = "n/a",
  venueStreetAddress = "n/a",
  venueCityZipCode = "n/a",
  images = {},
  widthClassName = "w-50 w-third-l",
  aspectRatioClass = "aspect-ratio--5x8"
}) {
  const { startTime, endTime } = formatEventTimes(eventStartTime, eventEndTime);
  const eventStartDate = formatEventDate(eventStartTime);
  return (
    <div className={`fl pr3 pv3 ${widthClassName}`}>
      <div className="eventCard flex flex-column">
        <div
          style={{
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundImage: `url(${getFirstImageUrl(images)})`
          }}
          className={`eventCard__image-container dim aspect-ratio ${aspectRatioClass} bg-white-10`}
        />
        <div className="eventCard__content-container flex flex-column pl1">
          <p className="michroma f9 tracked lh-title white-50 pv2 ttu tl">
            {`@ ${venueName}`}
          </p>
          <p className="michroma f6 tracked lh-title white-90 pb2 ttu tl">
            {`${eventTitle}`}
          </p>
          <p className="michroma f8 tracked lh-title white-80 pb2 tl">
            {`${eventStartDate}`}
          </p>
          <p className="michroma f8 tracked lh-title white-80 pb2 tl">
            {`${startTime} - ${endTime}`}
            <span className="pt2 db ttc tracked f9 white-60">
              * eastern time
            </span>
          </p>
        </div>
        <button className="dn db-ns vippyButton vippyButton--smaller mt2 mw1 self-start dim">
          <div className="vippyButton__innerColorBlock">
            <div className="w-100 h-100 flex flex-column justify-center">
              <p className="michroma f8 tracked-1 b ttu lh-extra white-90 center pb1">
                view
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
  // return (
  //   <div className="mv2 w-100 pb1 ph1">
  //     <Card className="flex flex-column flex-row-ns">
  //       <div className="w-100 w-50-ns bg-vippy-2">
  //         <CardHeader
  //           className="bg-vippy-2"
  //           action={
  //             <IconButton>
  //               <MoreVertIcon />
  //             </IconButton>
  //           }
  //           title={eventTitle}
  //           subheader={eventStartDate}
  //           titleTypographyProps={{
  //             className: "f7-important white-important"
  //           }}
  //           subheaderTypographyProps={{
  //             className: "f7-important white-wash-important"
  //           }}/>
  //         <CardContent
  //           component="div"
  //           className="bg-vippy-2 padding-top-025-important">
  //           <div className="flex flex-row flex-wrap flex-grow-0 mw6">
  //             <div className="flex flex-column flex-grow-1 self-end mb2">
  //               <div className="flex items-center flex-grow-1 justify-between ph1 mb1 white">
  //                 <p className="michroma f8 b tracked ttu">Start Time:</p>
  //                 <p className="michroma f8 ml1">{startTime}</p>
  //               </div>
  //               <div className="flex items-center flex-grow-1 justify-between ph1 mb1 white">
  //                 <p className="michroma f8 b tracked ttu">End Time:</p>
  //                 <p className="michroma f8 ml1">{endTime}</p>
  //               </div>
  //             </div>
  //             <div className="flex flex-column white flex-grow-1 self-end tr">
  //               <p className="michroma f8 b tracked ttu mb1">{venueName}</p>
  //               <p className="michroma f8 b tracked ttu mb1">
  //                 {venueStreetAddress}
  //               </p>
  //               <p className="michroma f8 b tracked ttu mb1">
  //                 {venueCityZipCode}
  //               </p>
  //             </div>
  //           </div>
  //         </CardContent>
  //       </div>
  //       <div className="w-100 w-50-ns h-100">
  //         <CardActionArea>
  //           <CardMedia
  //             className="aspect-ratio aspect-ratio--8x5 aspect-ratio--1x1-ns"
  //             image="https://res.cloudinary.com/vippy/image/upload/v1558318218/vippy-event-images/nightclub-image_l5lcmq.jpg"
  //             title="Club Tier"
  //           />
  //         </CardActionArea>
  //         <CardActions className="cf w-100 bg-dark-gray">
  //           <Button
  //             size="small"
  //             color="primary"
  //             fullWidth
  //             className="michroma-important f8-important tracked">
  //             view event's packages
  //           </Button>
  //         </CardActions>
  //       </div>
  //     </Card>
  //   </div>
  // );
}

export function ListingCard({
  listing = {},
  packageTitle = "n/a",
  eventDate = "n/a",
  eventStartTime = "-:--",
  eventEndTime = "-:--",
  guestCount = "--",
  price = "--.--",
  venueName = "n/a",
  venueStreetAddress = "n/a",
  venueCityZipCode = "n/a",
  bookingDeadline = "",
  images = {},
  widthClassName = "w-50"
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
    <div className={`fl pr3 pv3 ${widthClassName}`}>
      <Link to={`/listing/${listing.id}`}>
        <div className="listingCard flex flex-column dim-1">
          <div
            style={{
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundImage: `url(${getFirstImageUrl(images)})`
            }}
            className="listingCard__image-container aspect-ratio aspect-ratio--7x5 bg-white-10"
          />
          <div className="listingCard__content-container flex flex-column">
            <p className="michroma f9 tracked lh-title white-50 pv2 ttu tl">
              {`@ ${venueName}`}
            </p>
            <p className="michroma f6 tracked lh-title white-90 pb2 ttu tl">
              {`${packageTitle}`}
            </p>
            <p className="michroma f8 tracked lh-title white-80 pb2 tl">
              {`${eventStartDate}`}
            </p>
            <p className="michroma f8 tracked lh-title white-80 pb2 tl">
              {`${startTime} - ${endTime}`}
              <span className="pt2 db ttc tracked f9 white-60">
                * eastern time
              </span>
            </p>
            <p className="michroma f7 tracked lh-title white-90 pb2 ttu tl">
              {`$${price} / up to ${guestCount} guest`}
            </p>
          </div>
          <button className="dn db-ns vippyButton vippyButton--smaller mt2 mw1 self-start dim">
            <div className="vippyButton__innerColorBlock">
              <div className="w-100 h-100 flex flex-column justify-center">
                <p className="michroma f8 tracked-1 b ttu lh-extra white-90 center pb1">
                  view
                </p>
              </div>
            </div>
          </button>
        </div>
      </Link>
    </div>
  );
  // return (
  //   <Fragment>
  //     <div className="mv2 w-100 pb1 ph1">
  //       <Card className="flex flex-column">
  //         <CardHeader
  //           className="bg-vippy-2"
  //           action={
  //             <IconButton>
  //               <MoreVertIcon />
  //             </IconButton>
  //           }
  //           title={packageTitle}
  //           subheader={`at ${venueName} on ${eventStartDate}`}
  //           titleTypographyProps={{
  //             className: "f7-important white-important michroma-important"
  //           }}
  //           subheaderTypographyProps={{
  //             className: "f8-important white-wash-important michroma-important"
  //           }}
  //         />
  //         <CardContent
  //           component="div"
  //           className="padding-top-025-important bg-vippy-2"
  //         >
  //           <p className="flex w-100 pa1 michroma f8 b tracked ttu white mt1 mb3">
  //             Booking ends {formattedBookingDeadline}
  //           </p>
  //           <div className="flex flex-row flex-wrap flex-grow-0">
  //             <div className="flex pv1 pr1">
  //               <div className="flex items-center justify-between ph1 mb1 white">
  //                 <p className="michroma f8 b tracked ttu">Guest Count:</p>
  //                 <p className="michroma f8 ml1">{guestCount}</p>
  //               </div>
  //             </div>
  //             <div className="flex pv1 pr1">
  //               <div className="flex items-center justify-between ph1 mb1 white">
  //                 <p className="michroma f8 b tracked ttu">Price:</p>
  //                 <p className="michroma f8 ml1">${price}</p>
  //               </div>
  //             </div>
  //             <p className="flex w-100 pa1 michroma f8 b tracked ttu light-gray mt1 mb2 bg-black-10">
  //               this package's event info :
  //             </p>
  //             <div className="flex flex-column flex-grow-1 self-start mb2">
  //               <div className="flex items-center flex-grow-1 justify-between ph1 mb1 white">
  //                 <p className="michroma f8 b tracked ttu">Start Time:</p>
  //                 <p className="michroma f8 ml1">{startTime}</p>
  //               </div>
  //               <div className="flex items-center flex-grow-1 justify-between ph1 mb1 white">
  //                 <p className="michroma f8 b tracked ttu">End Time:</p>
  //                 <p className="michroma f8 ml1">{endTime}</p>
  //               </div>
  //             </div>
  //             <div className="flex flex-column white flex-grow-1 self-end tr">
  //               <p className="michroma f8 b tracked ttu mb1">{venueName}</p>
  //               <p className="michroma f8 b tracked ttu mb1">
  //                 {venueStreetAddress}
  //               </p>
  //               <p className="michroma f8 b tracked ttu mb1">
  //                 {venueCityZipCode}
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
}
