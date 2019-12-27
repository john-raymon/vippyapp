var express = require("express");
var router = express.Router();
var querystring = require("querystring");
var request = require("request");
const differenceInMinutes = require("date-fns/difference_in_minutes");
const isFuture = require("date-fns/is_future");
const isValid = require("date-fns/is_valid");
const isAfter = require("date-fns/is_after");

// cloudinary
var cloudinary = require("cloudinary");

// auth middleware
var auth = require("../authMiddleware");
var hostOrPromoterMiddleware = auth.hostOrPromoterMiddleware(false);
var hostOnlyMiddleware = auth.hostOrPromoterMiddleware(true);

// cloudinary parser middleware
var imageParser = require("./../../config/multer-cloudinary");

// models
var Event = require("../../models/Event");
var Host = require("../../models/Host");

// config
var config = require("./../../config");

router.param("event", function(req, res, next, eventId) {
  Event.findById(eventId)
    .populate("host")
    .populate({
      path: "currentListings",
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
    .then(function(event) {
      if (!event) {
        return res.status(404).json({
          success: false,
          errors: {
            promoter: {
              message: `An event with the id ${eventId} does not exist`
            }
          }
        });
      }
      req.vippyEvent = event;
      next();
    })
    .catch(next);
});

// Create Events endpoint, only Venue Host and authenticated Promoter's belonging to Venue Host, with proper permissions can Create Events
router.post(
  "/",
  auth.required,
  hostOrPromoterMiddleware,
  auth.onlyPromoterWithCreateUpdateEventsPermissions,
  function(req, res, next) {
    //debugger;
    console.log("the req.body at POST event/ endpoint is", req.body);
    const { vippyPromoter, vippyHost: host } = req;

    if (!(host ? host.hasStripeId() : vippyPromoter.venue.hasStripeId())) {
      return res.status(404).json({
        success: false,
        error: "You must connect to Stripe before creating an Event"
      });
    }

    // validate startTime and end time
    if (!isValid(new Date(req.body.startTime))) {
      return next({
        name: "ValidationError",
        message: "The start time is not a valid date and time"
      });
    }

    if (!isValid(new Date(req.body.endTime))) {
      return next({
        name: "ValidationError",
        message: "The end time is not a valid date and time"
      });
    }

    // make sure startTime is set in the future
    if (!isFuture(new Date(req.body.startTime))) {
      return next({
        name: "ValidationError",
        message: "The start time must be in the future"
      });
    }

    // make sure end time is set after the starttime
    if (!isAfter(new Date(req.body.endTime), new Date(req.body.startTime))) {
      return next({
        name: "ValidationError",
        message: "The end time must be after the start of the event"
      });
    }
    // make sure the difference in the endtime and startTime minutes are no less than 30 minutes
    if (
      differenceInMinutes(
        new Date(req.body.endTime),
        new Date(req.body.startTime)
      ) < 30
    ) {
      return next({
        name: "ValidationError",
        message: "Your event duration must be at least half an hour long"
      });
    }

    const event = new Event({
      name: req.body.name,
      venueId: host ? host.venueId : vippyPromoter.venue.venueId,
      host: host ? host : vippyPromoter.venue,
      date: req.body.startTime,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      address: {
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip || req.body.zipcode
      }
    });

    return event
      .save()
      .then(savedEvent => {
        req.vippyEvent = savedEvent;
        return next();
        //  res.json({ success: true, event: savedEvent.toJSONFor() });
      })
      .catch(next);
  },
  imageParser.array("eventImages", 10),
  function(req, res, next) {
    const { vippyEvent } = req;
    if (req.files) {
      const newImages = req.files.reduce((newImagesObj, file) => {
        newImagesObj[file.public_id] = {
          url: file.url,
          public_id: file.public_id
        };
        return newImagesObj;
      }, {});
      let eventImagesObject = {}; // convert Map to JS Object
      for (let [key, value] of vippyEvent.images) {
        eventImagesObject[key] = value;
      }
      vippyEvent.images = { ...eventImagesObject, ...newImages };
    }
    vippyEvent
      .save()
      .then(event => {
        return res.json({
          success: true,
          event: event.toJSONFor()
        });
      })
      .catch(next);
  }
);

router.patch(
  "/:event",
  auth.required,
  hostOrPromoterMiddleware,
  auth.onlyPromoterWithCreateUpdateEventsPermissions,
  imageParser.array("eventImages", 10),
  async function(req, res, next) {
    const { vippyEvent, vippyHost, vippyPromoter } = req;

    // if host , check if event belongs to host/
    // if promoter, check if event belongs to promoter's host
    if (
      (vippyHost && !vippyHost._id.equals(vippyEvent.host._id)) ||
      (vippyPromoter && vippyPromoter.venueId !== vippyEvent.host.venueId)
    ) {
      return next({
        name: "UnauthorizedError",
        message:
          "You must the venue host of this event or promoter of the venue host of this event with proper permissions to make changes to this event"
      });
    }

    if (vippyEvent.cancelled) {
      return next({
        name: "BadRequestError",
        message: "You can no longer update this event as it has been cancelled."
      });
    }

    // make sure event is still active
    if (!isFuture(new Date(vippyEvent.endTime))) {
      return next({
        name: "ValidationError",
        message: "You can longer update this event as it has passed"
      });
    }

    const whitelistedKeys = ["name"];
    // changes to date, starttime, endtime, address are not allowed to be updated after creation of event,
    // a deactivation of this event along with a new event with the
    // preferred date, startTime, endtime, address will need to take be created
    // /event/deactivate endpoint will be used for deactivating since sideeffects
    // and constrains will need be to checked, deactivating connected listings, refunding reservations.
    // multiple event cancellations will result in suspension of host , set event cap in env variables

    for (let prop in req.body) {
      if (whitelistedKeys.includes(prop)) {
        vippyEvent[prop] = req.body[prop];
      }
    }
    let newImages = {};
    if (req.files) {
      newImages = req.files.reduce((newImagesObj, file) => {
        newImagesObj[file.public_id] = {
          url: file.url,
          public_id: file.public_id
        };
        return newImagesObj;
      }, {});
      let eventImagesObject = {}; // convert Map to JS Object
      for (let [key, value] of vippyEvent.images) {
        eventImagesObject[key] = value;
      }
      vippyEvent.images = { ...eventImagesObject, ...newImages };
    }

    if (req.body.imageIdsToRemove) {
      for (let publicId of req.body.imageIdsToRemove) {
        try {
          const destroyImage = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(publicId, {}, (error, result) => {
              if (error) reject(error);
              resolve(result);
            });
          });
          if (destroyImage) {
            let eventImagesObject = {}; // convert Map to JS Object
            for (let [key, value] of vippyEvent.images) {
              eventImagesObject[key] = value;
            }
            vippyEvent.images = {
              ...eventImagesObject,
              ...newImages,
              [publicId]: undefined
            };
          }
        } catch (err) {
          next(err);
        }
      }
    }

    vippyEvent.save().then(event => {
      res.json({
        success: true,
        event: event.toJSONFor(vippyHost || vippyPromoter & vippyPromoter.venue)
      });
    });
  }
);

// get specific event by id, no authentication required,
// if authenticated Venue Host, or Promoter, it will return
// the event object with the event's listing's currentReservations
// or
// get all events, no authentication required,
// if authenticated Venue Host, or Promoter, it will return
// event objects with the each event's listing's currentReservations
router.get("/:event?", auth.optional, auth.setUserOrHost, function(
  req,
  res,
  next
) {
  if (req.vippyEvent) {
    return res.json({
      success: true,
      event: req.vippyEvent.toJSONFor(
        req.vippyHost || (req.vippyPromoter && req.vippyPromoter.venue)
      )
    });
  } else {
    let query = {}; // query based on date and other stuff later on
    let limit = 20;
    let offset = 0;

    if (req.query.byVenue) {
      query = {
        ...query,
        ["venueId"]: req.query.byVenue
      };
      console.log("this is the query", req.query);
    }

    if (typeof req.body.limit !== "undefined") {
      limit = req.body.limit;
    }

    if (typeof req.body.offset !== "undefined") {
      offset = req.body.offset;
    }

    Promise.all([
      Event.find(query)
        .limit(+limit)
        .skip(+offset)
        .populate("host")
        .populate({
          path: "currentListings",
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
      Event.count(query).exec()
    ])
      .then(([events, eventsCount]) => {
        res.json({
          success: true,
          events: events.map(event => {
            console.log("this is an event in the map", event);
            return event.toJSONFor(
              req.vippyHost || (req.vippyPromoter && req.vippyPromoter.venue)
            ); // may return auth versions of events and listing objects within event
          }),
          eventsCount: eventsCount
        });
      })
      .catch(next);
  }
});

module.exports = router;
