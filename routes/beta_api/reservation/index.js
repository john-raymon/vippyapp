const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const querystring = require("querystring");
const request = require("request");
const crypto = require("crypto");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const isFuture = require("date-fns/is_future");
const uniqid = require("uniqid");
const qr = require("qr-image");
const twilio = require("twilio");
const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const {
  FORBIDDEN_RESERVATION,
  FORBIDDEN_RESERVATION_MESSAGE
} = require("../../../config/error-constants");
// auth middleware
const auth = require("../../authMiddleware");
const { hostMiddleware } = require("../host");

// models
const Event = require("../../../models/Event");
const Host = require("../../../models/Host");
const Listing = require("../../../models/Listing");
const Reservation = require("../../../models/Reservation");

// config
const config = require("../../../config");

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
          error: "We could not locate the reservation."
        });
      }
      req.vippyReservation = reservation;
      next();
    })
    .catch(next);
});

// router.post('/:reservationId', auth)
// TODO: only return ticket qr-code image if still valid (20 minutes after creation of reservation)
// as any attempt after the 20 minute shouldn't return the ticket
router.get("/:reservationId/qr-code", function(req, res, next) {
  console.log("REQUEST FROM TWILIO FOR, ", req.vippyReservation._id);
  if (req.vippyReservation.qrCodeImageGenerated) {
    console.log("REQUEST FROM TWILIO FOR, ", req.vippyReservation._id);
    return res.status(404).json({
      success: false,
      error: "We could not locate a the qr-code."
    });
  }
  console.log("REQUEST FROM TWILIO FOR, ", req.vippyReservation._id);
  try {
    const code = qr.image(
      `getvippy.com/?qr-code=${req.vippyReservation.qrCode || ""}`,
      { type: "png" }
    );
    req.vippyReservation.qrCodeImageGenerated = true;
    req.vippyReservation.save();
    res.setHeader("Content-type", "image/png"); //sent qr image to client side
    code.pipe(res);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end("<h1>Unable to load code for reservation</h1>");
  }
});

// DEPECRECATED,
// TODO: NO LONGER REQUIRE REDEEMING,create endpoint to cancel and refund reservation with
// a constraint of only allowing cancellations up to 1 hour into the event or up to 2 hours before the event.
// only allow venue/host or vippy admin to cancel&refund the reservation to prevent fraud where reservation
// was used in person and then cancelled after but still used in person.
// HANDLE TRANSFERING funds of non-cancelled reservations to venue/host related to reservation
// via a job set after the event ends.
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
          // TODO: move this logic over to a job that transfers amount for venue/host
          // after event related to uncancelled reservation ends.
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
                // will not prevent the redeeming. Do this to ensure a the Host is paid automatically after the sucessfull redeeming but failed transfer, which is what occured here, at this point.
                // Right now only way is a manual transfer via Vippy Stripe Dashboard
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
    // if req.query.verify is not set then, Send Code to customer
    return request(
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

// DEPRECATED
// create a reservation
router.post("/", auth.required, auth.setUserOrHost, function(req, res, next) {
  if (!req.vippyUser) {
    // only regular users can purchase/reserve a listing
    return res.status(403).json({
      success: false,
      error: "You must be logged in as a user."
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
  return Listing.findById(req.query.listing)
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
            "The listing is no longer available, the venue may have removed it, we apologize for the inconvenience."
        });
        // TODO: interpolate the business number of the listing's venue to allow customer to call if there was sometype of charge
        // that they can refund
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

            // generate fresh code for qrcode
            const qrCode = uniqid();

            const reservation = new Reservation({
              id: reservationConfirmationCode,
              customer: req.vippyUser,
              host: listing.host,
              listing: listing,
              payAndWait: listing.payAndWait,
              totalPrice: listing.bookingPrice,
              stripeChargeId: charge.id,
              paid: true,
              qrCodeImageGenerated: false,
              qrCode
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
          return res.json({
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
      return twilioClient.messages
        .create({
          body: "Scan this code at the door to redeem your reservation.",
          from: process.env.TWILIO_PHONE_NUMBER,
          mediaUrl: [
            `${"http://b41cf5113975.ngrok.io" ||
              config.serverBaseUrl}/api/reservation/${reservation._id}/qr-code`
          ],
          to: reservation.customer.phonenumber
        })
        .then(message => {
          console.log(message);
          // we should have a reservation and a listings
          // return the reservation created to the user
          let reservationResponse = {
            ...reservation.toProfileJSON(),
            listing: listing._toJSON()
          };
          return res.json({
            success: true,
            reservation: reservationResponse
          });
        })
        .catch(error => {
          console.log("error sending reservation's qr code to customer", error);
          throw error;
        }); // TODO: handle this error better
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
    // TODO: this if statement may not be needed since it checks for all possible auth users
    // which is what auth.required does
    return res.status(403).json({
      success: "false",
      error: "You must be logged in"
    });
  }

  if (req.vippyReservation) {
    // check if router.param for :reservationId selected and set req.vippyReservation
    if (
      (req.vippyUser &&
        req.vippyUser.id !== req.vippyReservation.customer.id) ||
      (req.vippyHost && req.vippyHost.id !== req.vippyReservation.host.id) ||
      (req.vippyPromoter &&
        req.vippyPromoter.venueId !== req.vippyReservation.host.venueId)
    ) {
      // check if req.vippyReservation belongs to authenticated venue/host, promoter, or user
      return res.status(403).json({
        success: false,
        errorType: FORBIDDEN_RESERVATION,
        message: FORBIDDEN_RESERVATION_MESSAGE,
        error: FORBIDDEN_RESERVATION_MESSAGE
      });
    }
    return res.json({
      // return the fetched reservation
      success: true,
      reservation: {
        ...req.vippyReservation.toProfileJSON(),
        listing: req.vippyReservation.listing.toJSONForHost(
          req.vippyUser || req.vippyHost || req.vippyPromoter
        )
      }
    });
  } else {
    // if no req.vippyReservation then request did not have :reservationId so return query results
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
      .then(([reservations, reservationCount]) => {
        res.json({
          success: true,
          reservations: reservations.map(r => {
            return {
              ...r.toProfileJSON(),
              listing: r.listing.toJSONForHost(
                req.vippyUser || req.vippyHost || req.vippyPromoter
              )
            };
          }),
          reservationCount
        });
      })
      .catch(next);
  }
});

module.exports = router;
