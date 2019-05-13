var express = require("express");
var router = express.Router();
var querystring = require("querystring");
var request = require("request");

// auth middleware
var auth = require("../authMiddleware");
var hostOrPromoterOnlyMiddleware = auth.hostOrPromoterMiddleware(false);
var hostOnlyMiddleware = auth.hostOrPromoterMiddleware(true);

// models
var Event = require("../../models/Event");
var Host = require("../../models/Host");
var Listing = require("../../models/Listing");

// config
var config = require("./../../config");

router.param("listing", function(req, res, next, listingId) {
  Listing.findById(listingId)
    .populate("host")
    .populate({
      path: "event",
      populate: { path: "host" }
    })
    .exec()
    .then(function(listing) {
      console.log("the listing is", listing);
      if (!listing) {
        return res.sendStatus(404);
      }
      req.listing = listing;
      next();
    })
    .catch(next);
});

// Create Listings -- only the Venue Host on the Event and Promoter (with proper permissions) of the Venue Host on Event can Create Listings
router.post(
  "/",
  auth.required,
  hostOrPromoterOnlyMiddleware,
  auth.onlyPromoterWithCreateUpdateListingsPermissions,
  function(req, res, next) {
    const { vippyHost: host, vippyPromoter } = req;
    Event.findById(req.body.eventId)
      .populate("host")
      .populate("currentListings")
      .exec()
      .then(function(event) {
        if (!event) {
          res.status(404).json({
            success: false,
            errors: {
              event: {
                message: `We could not locate an Event with the id ${
                  req.body.eventId
                }`
              }
            }
          });
        }
        // make sure host or promoter belong to Event
        if (
          (host && host.id !== event.host.id) ||
          (vippyPromoter && vippyPromoter.venue.id !== event.host.id)
        ) {
          return next({
            name: "UnauthorizedError",
            message:
              "You must the venue host of this event or promoter of the venue host of this event with proper permissions to create listings for this event"
          });
        }
        // proceed to create listing
        const listing = new Listing({
          name: req.body.name,
          guestCount: req.body.guestCount,
          payAndWait: req.body.hasPayAndWait,
          // images: req.body.endTime, // use multer and cloudinary to store images
          bookingPrice: req.body.bookingPrice,
          disclaimers:
            req.body.disclaimers +
            " You must be able to receive a verfication code to the phone number on your account at the door in order to redeem your reservation.",
          quantity: req.body.unlimitedQuantity ? 0 : req.body.quantity,
          unlimitedQuantity: req.body.unlimitedQuantity
          // bookingDeadline: only allow this to be set to up to 6 hours before event's startTime.
        });

        listing.host = host ? host : vippyPromoter.venue;
        listing.event = event;

        event.currentListings = [...event.currentListings, listing._id];

        return Promise.all([listing.save(), event.save()]);
      })
      .then(function([listing]) {
        res.json({ listing: listing._toJSON() });
      })
      .catch(next);
  }
);

// get listing by id, no authentication required,
// if authenticated Venue Host, or Promoter, it will return
// listing object with the currentReservations
router.get("/:listing", auth.optional, auth.setUserOrHost, function(
  req,
  res,
  next
) {
  const { auth = { sub: "" }, listing: currentListing } = req;
  console.log("The type of authenticated user is a", auth.sub);
  if (auth.sub === "host") {
    res.json({ listing: currentListing.toJSONForHost(req.vippyHost) });
  }
  res.json({ listing: currentListing._toJSON() });
});

// get all listings, no authentication required,
// if authenticated Venue Host, or Promoter, it will return
// listing objects with the currentReservations
router.get("/", auth.optional, auth.setUserOrHost, function(req, res, next) {
  let query = {}; // query based on date and other stuff later on
  let limit = 20;
  let offset = 0;

  if (typeof req.body.limit !== "undefined") {
    limit = req.body.limit;
  }

  if (typeof req.body.offset !== "undefined") {
    offset = req.body.offset;
  }

  Promise.all([
    Listing.find(query)
      .limit(+limit)
      .skip(+offset)
      .populate("host")
      .populate({
        path: "event",
        populate: {
          path: "host"
        }
      })
      .exec(),
    Listing.count(query).exec()
  ])
    .then(([listings, listingCount]) => {
      res.json({
        listings: listings.map(listing => {
          if (req.auth && req.vippyHost) {
            return listing.toJSONForHost(req.vippyHost);
          }
          return listing.toJSONForHost();
        }),
        listingCount: listingCount
      });
    })
    .catch(next);
});

module.exports = router;
