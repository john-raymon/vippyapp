var express = require("express");
var router = express.Router();
var querystring = require("querystring");
var request = require("request");

// auth middleware
var auth = require("../authMiddleware");
var { hostMiddleware } = require("./host");

// models
var Event = require("../../models/Event");
var Host = require("../../models/Host");
var Listing = require("../../models/Listing");

// config
var config = require("./../../config");

router.param("listing", function(req, res, next, listingId) {
  Listing.findById(listingId)
    .populate("host")
    .populate("event")
    .exec()
    .then(function(listing) {
      if (!listing) {
        return res.sendStatus(404);
      }

      req.listing = listing;
    })
    .catch(next);
});

router.post("/", auth.required, hostMiddleware, function(req, res, next) {
  console.log("the req.body at POST listing/ endpoint is", req.body);
  const { vippyHost: host } = req;

  console.log("the event is", req.body.eventId);
  Event.findById(req.body.eventId)
    .populate("host")
    .populate("currentListings")
    .exec()
    .then(function(event) {
      console.log("the event were grttng back is", event);
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

      listing.host = host;
      listing.event = event;

      return listing.save().then(function(listing) {
        res.json({ listing: listing._toJSON() });
      });
    })
    .catch(next);
});

router.get("/:listing", auth.optional, function(req, res, next) {
  const { auth, listing: currentListing } = req;
  console.log("The type of authenticated user is a", auth.sub);
  if (auth.sub === "host") {
    res.json({ listing: listing.toJSONForHost() });
  }
  res.json({ listing: listing._toJSON() });
});

module.exports = router;
