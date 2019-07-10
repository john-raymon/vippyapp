var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var querystring = require("querystring");
var request = require("request");
var crypto = require("crypto");
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const isFuture = require("date-fns/is_future");
const {
  FORBIDDEN_RESERVATION,
  FORBIDDEN_RESERVATION_MESSAGE
} = require("../../config/error-constants");
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

router.param("reservationId", function(req, res, next, reservationId) {
  // attempt to locate reservation
  return Reservation.findById(reservationId)
    .populate("host")
    .populate("customer")
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
    .exec()
    .then(function(reservation) {
      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: "There is no active reservation with that id."
        });
      }
      req.vippyReservation = reservation;
      next();
    })
    .catch(next);
});

// begin redeeming of reservation
router.post(
  "/:reservationId/redeem",
  auth.required,
  auth.setUserOrHost,
  function(req, res, next) {
    console.log("vippypromoter", req.vippyPromoter);
    console.log("reservation host", req.vippyReservation.host);
    if (
      (req.vippyUser &&
        req.vippyUser.id !== req.vippyReservation.customer.id) ||
      (req.vippyHost && req.vippyHost.id !== req.vippyReservation.host.id) ||
      (req.vippyPromoter &&
        req.vippyPromoter.venueId !== req.vippyReservation.host.venueId)
    ) {
      return res.status(403).json({
        success: false,
        errorType: FORBIDDEN_RESERVATION,
        error: FORBIDDEN_RESERVATION_MESSAGE,
        message: FORBIDDEN_RESERVATION_MESSAGE
      });
    }

    if (req.vippyReservation.cancelled) {
      return next({
        name: "BadRequestError",
        message:
          "The event you were trying to reserve for has been cancelled, we apologize for the inconvenience."
      });
    }

    if (!isFuture(new Date(req.vippyReservation.listing.event.endTime))) {
      return next({
        name: "BadRequestError",
        message:
          "This listing can no longer be redeemed as the event has passed, we apologize for the inconvenience."
      });
    }

    if (req.vippyReservation.redeemed) {
      return res.status(404).json({
        success: false,
        error: "This reservation has already been redeemed"
      });
    }
    // if query.param "code" is set then attempt to verify the phone number with the code,
    // if verified succesfully mark the reservation as redeemed.
    if (req.query.verify) {
      return request(
        {
          url: "https://api.authy.com/protected/json/phones/verification/check",
          method: "GET",
          headers: {
            "X-Authy-API-Key": process.env.TWILIO_ACCOUNT_SECURITY_API_KEY
          },
          qs: {
            verification_code: req.body.verification_code,
            phone_number: req.vippyReservation.customer.phonenumber,
            country_code: req.vippyReservation.customer.countryCallingCode
          },
          json: true
        },
        function(err, response, body) {
          if (!body.success || err) {
            return res.status(400).json({
              success: false,
              error: body.message
            });
          }
          // if verified successfully then set reservation as redeemed, res with success.
          // also create transfer for Host
          // Create a Transfer to the connected account (later):
          req.vippyReservation.redeemed = body.success;
          return stripe.transfers.create(
            {
              amount: req.vippyReservation.amountForHost() * 100,
              currency: "usd",
              source_transaction: req.vippyReservation.stripeChargeId,
              destination: req.vippyReservation.host.stripeAccountId,
              transfer_group: req.vippyReservation.id
            },
            function(err, transfer) {
              if (err) {
                console.log("the stripe transfer error was", err);
                // could not make transfer
                // TODO: do something, to document this failed transfer in order to retry later, since a failed trasnfer
                // will not prevent the redeeming.
                req.vippyReservation.paidToHost = false;
                return req.vippyReservation
                  .save()
                  .then(function(reservation) {
                    return res.json({
                      ...body,
                      reservation
                    });
                  })
                  .catch(next);
              }
              // charged update reservation and return
              req.vippyReservation.paidToHost = true;
              req.vippyReservation.stripeTransferId = transfer.id;
              return req.vippyReservation
                .save()
                .then(function(reservation) {
                  return res.json({
                    ...body,
                    reservation
                  });
                })
                .catch(next);
            }
          );
        }
      );
    }
    // Send Code to customer
    request(
      {
        url: "https://api.authy.com/protected/json/phones/verification/start",
        method: "POST",
        headers: {
          "X-Authy-API-Key": process.env.TWILIO_ACCOUNT_SECURITY_API_KEY
        },
        form: {
          via: "sms",
          phone_number: req.vippyReservation.customer.phonenumber,
          country_code: req.vippyReservation.customer.countryCallingCode
        },
        json: true
      },
      function(err, response, body) {
        if (!body.success || err) {
          return res.status(400).json({ error: body.message });
        }
        return res.json(body);
      }
    );
  }
);

// create a reservation
router.post("/", auth.required, auth.setUserOrHost, function(req, res, next) {
  if (!req.vippyUser) {
    return res.status(403).json({
      success: false,
      error: "You must be logged in as a user or a venue"
    });
  }
  if (!req.query.listing) {
    return res.status(400).json({
      success: false,
      errors: {
        listing: {
          message: "You must provide a Listing ID to create a reservation for"
        }
      }
    });
  }
  if (!mongoose.Types.ObjectId.isValid(req.query.listing)) {
    return res.status(400).json({
      success: false,
      errors: {
        listing: {
          message: "You must provide a valid Listing ID"
        }
      }
    });
  }
  if (!req.body.cardToken && process.env.NODE_ENV === "production") {
    return res.status(400).json({ error: "A Stripe card token is required" });
  }
  Listing.findById(req.query.listing)
    .then(function(listing) {
      if (!listing) {
        return res.status(400).json({
          success: false,
          error:
            "We could not locate a Listing with the ID of" + req.query.listing
        });
      }

      if (listing.cancelled) {
        return next({
          name: "BadRequestError",
          message:
            "You can no longer update this event as it has been cancelled."
        });
      }

      if (!isFuture(new Date(listing.bookingDeadline))) {
        return next({
          name: "BadRequestError",
          message:
            "This listing can no longer be reserved as it's booking deadline has passed, we apologize for the inconvenience."
        });
      }

      if (!listing.unlimitedQuantity && listing.quantity === 0) {
        return res.status(400).json({
          success: false,
          errors: {
            listing: {
              message:
                "This listing is sold out, we apologize for the inconvenience."
            }
          }
        });
      }
      const reservationConfirmationCode = crypto.randomBytes(8).toString("hex");
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
            listing.quantity = listing.unlimitedQuantity
              ? listing.quantity
              : listing.quantity - 1;
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
            success: false,
            errors: {
              listing: {
                message: "We could not charge your card please try again later"
              }
            }
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
        success: true,
        reservation: reservationResponse
      });
    })
    .catch(next);
});

// get a reservation
router.get("/:reservationId?", auth.required, auth.setUserOrHost, function(
  req,
  res,
  next
) {
  if (!req.vippyUser && !req.vippyHost && !req.vippyPromoter) {
    return res.status(403).json({
      success: "false",
      error: "You must be an Authenticated host or user"
    });
  }
  if (req.vippyReservation) {
    if (
      (req.vippyUser &&
        req.vippyUser.id !== req.vippyReservation.customer.id) ||
      (req.vippyHost && req.vippyHost.id !== req.vippyReservation.host.id) ||
      (req.vippyPromoter &&
        req.vippyPromoter.venueId !== req.vippyReservation.host.venueId)
    ) {
      return res.status(403).json({
        success: false,
        errorType: FORBIDDEN_RESERVATION,
        message: FORBIDDEN_RESERVATION_MESSAGE,
        error: FORBIDDEN_RESERVATION_MESSAGE
      });
    }
    return res.json({
      success: true,
      reservation: {
        ...req.vippyReservation.toProfileJSON(),
        listing: req.vippyReservation.listing._toJSON()
      }
    });
  } else {
    let query = {},
      limit = 20,
      offset = 0;
    if (req.vippyHost) query.host = req.vippyHost._id;
    if (req.vippyPromoter) query.host = req.vippyPromoter.venue._id;
    if (req.vippyUser) query.customer = req.vippyUser._id;
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
      .then(([reservations, reservationsCount]) => {
        res.json({
          success: true,
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
  }
});

module.exports = router;
