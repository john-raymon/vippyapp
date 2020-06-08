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

export function PreviewEventCard({
  venueInitial = "",
  eventTitle = "n/a",
  eventStartTime = "--:--",
  eventEndTime = "--:--",
  venueName = "n/a",
  eventOrganizer = "",
  venueStreetAddress = "n/a",
  venueCityZipCode = "n/a",
  images = {},
  widthClassName = "w-50 w-third-l",
  aspectRatioClass = "aspect-ratio--5x8",
  textColor = "white",
  newRootClasses = "",
  newInnerContainerClasses = ""
}) {
  const { startTime, endTime } = formatEventTimes(eventStartTime, eventEndTime);
  const eventStartDate = formatEventDate(eventStartTime);
  const eventEndDate = formatEventDate(eventEndTime);
  return (
    <div
      className={
        newRootClasses ? newRootClasses : `fl pr3 pv3 ${widthClassName}`
      }
    >
      <div
        className={`eventCard__inner-container ${
          newInnerContainerClasses
            ? newInnerContainerClasses
            : `flex flex-column md:tw-px-4`
        }`}
      >
        <div className="tw-w-1/4 tw-pr-2">
          <div
            style={{
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundImage: `url(${getFirstImageUrl(images)})`
            }}
            className={`eventCard__image-container dim aspect-ratio ${aspectRatioClass} bg-${textColor}-10`}
          />
        </div>
        <div className="eventCard__content-container flex tw-w-3/4 flex-column pl1">
          <p
            className={`michroma tw-text-2xs tracked lh-title ${textColor}-50 tw-pb-2 ttu tl`}
          >
            {`@ ${venueName}`}
            {eventOrganizer && (
              <span className="tw-w-full tw-block tw-text-4xs tw-pt-2">
                {`organized by ${eventOrganizer}`}
              </span>
            )}
          </p>
          <p
            className={`michroma tw-text-sm tw-capitalize tracked lh-title ${textColor}-90 pb2 tl`}
          >
            {`${eventTitle}`}
          </p>
          <p
            className={`tw-flex tw-flex-col tw-items-start michroma tw-text-xs tracked lh-title ${textColor}-80 pb2 tl`}
          >
            <span className="tw-text-2xs tw-text-gray-600 tw-text-black tw-pb-1 tw-mb-1 tw-border-b tw-border-gray-300">
              Starts:
            </span>
            {`${eventStartDate} at ${startTime}`}
          </p>
          <p
            className={`tw-flex tw-flex-col tw-items-start michroma tw-text-xs tracked lh-title ${textColor}-80 pb2 tl`}
          >
            <span className="tw-text-2xs tw-text-gray-600 tw-text-black tw-pb-1 tw-mb-1 tw-border-b tw-border-gray-300">
              Ends:
            </span>
            {`${eventEndDate} at ${endTime}`}
          </p>
          <p
            className={`michroma tw-text-xs tracked lh-title ${textColor}-80 pb2 tl`}
          >
            <span className={`pt2 db ttc tracked tw-text-2xs ${textColor}-60`}>
              * eastern time
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

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
  aspectRatioClass = "aspect-ratio--5x8",
  textColor = "white",
  newRootClasses = "",
  newInnerContainerClasses = ""
}) {
  const { startTime, endTime } = formatEventTimes(eventStartTime, eventEndTime);
  const eventStartDate = formatEventDate(eventStartTime);
  return (
    <div
      className={
        newRootClasses ? newRootClasses : `fl pr3 pv3 ${widthClassName}`
      }
    >
      <div
        className={`eventCard__inner-container ${
          newInnerContainerClasses
            ? newInnerContainerClasses
            : `flex flex-column md:tw-px-4`
        }`}
      >
        <div
          style={{
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundImage: `url(${getFirstImageUrl(images)})`
          }}
          className={`eventCard__image-container dim aspect-ratio ${aspectRatioClass} bg-${textColor}-10`}
        />
        <div className="eventCard__content-container flex flex-column pl1">
          <p
            className={`michroma f9 tracked lh-title ${textColor}-50 pv2 ttu tl`}
          >
            {`@ ${venueName}`}
          </p>
          <p
            className={`michroma f6 tracked lh-title ${textColor}-90 pb2 ttu tl`}
          >
            {`${eventTitle}`}
          </p>
          <p className={`michroma f8 tracked lh-title ${textColor}-80 pb2 tl`}>
            {`${eventStartDate}`}
          </p>
          <p className={`michroma f8 tracked lh-title ${textColor}-80 pb2 tl`}>
            {`${startTime} - ${endTime}`}
            <span className={`pt2 db ttc tracked f9 ${textColor}-60`}>
              * eastern time
            </span>
          </p>
        </div>
        <button className="button tw-w-full tw-bg-green-500 tw-mt-4 tw-uppercase">
          view event
        </button>
      </div>
    </div>
  );
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
        <div className="listingCard flex flex-column dim-1 md:tw-px-4">
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
          <button className="button tw-p-3 tw-w-full tw-bg-green-500 tw-mt-4 tw-uppercase">
            view listing
          </button>
        </div>
      </Link>
    </div>
  );
}

export function ReservationCard({
  reservationId,
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
  images = {},
  widthClassName = "w-50"
}) {
  const { startTime, endTime } = formatEventTimes(eventStartTime, eventEndTime);
  const eventStartDate = formatEventDate(eventStartTime);
  return (
    <div className={`fl pr3 pv3 ${widthClassName}`}>
      <Link to={`/reservations/${reservationId}`}>
        <div className="reservationCard flex flex-row tw-flex-wrap dim-1 pv3 b--white-10 bw1 ba br2 pv4 md:tw-px-4">
          <div className="tw-w-full md:tw-w-2/6 self-center">
            <div
              style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundImage: `url(${getFirstImageUrl(images)})`
              }}
              className="reservationCard__image-container aspect-ratio aspect-ratio--7x5 bg-white-10"
            />
          </div>
          <div className="tw-w-full md:tw-w-4/6 ph3 pl4-l pr0-l flex flex-column justify-center">
            <div className="reservationCard__content-container flex flex-column">
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
            <button className="button tw-p-3 tw-w-full tw-bg-green-500 tw-mt-4 tw-uppercase">
              open my reservation
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
