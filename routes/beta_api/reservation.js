var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var querystring = require("querystring");
var request = require("request");
var crypto = require("crypto");
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// auth middleware
var auth = require("../authMiddleware");
var { hostMiddleware } = require("./host");

// models
var Event = require("../../models/Event");
var Host = require("../../models/Host");
var Listing = require("../../models/Listing");
var Reservation = require("../../models/Reservation");

// config
var config = require("./../../config");

router.post("/", auth.required, auth.setUserOrHost, function(req, res, next) {
  if (!req.vippyUser) {
    return res.status(403).json({ error: "You must be an Authenticated host" });
  }
  if (!req.query.listing) {
    return res.status(400).json({
      error: "You must provide a Listing ID to create a reservation for"
    });
  }
  if (!mongoose.Types.ObjectId.isValid(req.query.listing)) {
    return res
      .status(400)
      .json({ error: "You must provide a valid Listing ID" });
  }
  if (!req.body.cardToken && process.env.NODE_ENV === "production") {
    return res.status(400).json({ error: "A Stripe card token is required" });
  }
  Listing.findById(req.query.listing)
    .then(function(listing) {
      if (!listing) {
        return res.status(400).json({
          error:
            "We could not locate a Listing with the ID of" + req.query.listing
        });
      }
      if (!listing.unlimitedQuantity && listing.quantity === 0) {
        return res.status(400).json({
          error: "This listing is sold out, we apologize for the inconvenience."
        });
      }
      const reservationConfirmationCode = crypto
        .randomBytes(24)
        .toString("hex");
      console.log("0307b after variable", reservationConfirmationCode);
      return stripe.charges
        .create({
          amount: +listing.bookingPrice * 100,
          currency: "usd",
          description: "Listing Reservation",
          source:
            process.env.NODE_ENV === "production"
              ? req.body.cardToken
              : "tok_visa",
          transfer_group: reservationConfirmationCode,
          metadata: {
            reservationConfirmationCode: reservationConfirmationCode,
            hostId: listing.host.toString(),
            customerId: req.vippyUser._id.toString()
          }
        })
        .then(charge => {
          if (charge && charge.status === "succeeded") {
            // the charge succeeded continue
            // create reservation
            const reservation = new Reservation({
              id: reservationConfirmationCode,
              customer: req.vippyUser,
              host: listing.host,
              listing: listing,
              payAndWait: listing.payAndWait,
              totalPrice: listing.bookingPrice,
              stripeChargeId: charge.id,
              paid: true
            });
            listing.currentReservations = [
              ...listing.currentReservations,
              reservation._id
            ];
            return Promise.all([
              reservation.save().then(r => r.populate("host").execPopulate()),
              listing.save().then(listing =>
                listing
                  .populate("host")
                  .populate({ path: "event", populate: { path: "host" } })
                  .execPopulate()
              )
            ]);
          }
          res.json({
            error: "We could not charge your card, please try again"
          });
        });
    })
    .then(([reservation, listing]) => {
      // we should have a reservation and a listings
      // return the reservation created to the user
      let reservationResponse = {
        ...reservation.toProfileJSON(),
        listing: listing._toJSON()
      };
      res.json({
        reservation: reservationResponse
      });
    })
    .catch(next);
});

router.get("/", auth.required, auth.setUserOrHost, function(req, res, next) {
  if (!req.vippyUser && !req.vippyHost) {
    return res
      .status(403)
      .json({ error: "You must be an Authenticated host or user" });
  }
  let query = {},
    limit = 20,
    offset = 0;
  if (req.query.limit) {
    limit = req.query.limit;
  }
  if (req.query.offset) {
    offset = req.query.offset;
  }
  Promise.all([
    Reservation.find(query)
      .limit(+limit)
      .skip(+offset)
      .populate("customer")
      .populate("host")
      .populate({
        path: "listing",
        populate: [
          {
            path: "host"
          },
          {
            path: "event",
            populate: {
              path: "host"
            }
          }
        ]
      })
      .exec(),
    Reservation.count(query).exec()
  ])
    // .then(promises => {
    //   return Promise.all([
    //     ...promises,
    //     Listing
    //       .findById(reservation.listing)
    //   ])
    // })
    .then(([reservations, reservationsCount]) => {
      res.json({
        reservations: reservations.map(r => {
          return {
            ...r.toProfileJSON(),
            listing: r.listing._toJSON()
          };
        }),
        reservationsCount
      });
    })
    .catch(next);
});

module.exports = router;
