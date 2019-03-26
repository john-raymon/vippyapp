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

// config
var config = require("./../../config");

router.post("/", auth.required, hostMiddleware, function(req, res, next) {
  console.log("the req.body at POST event/ endpoint is", req.body);
  const { vippyHost: host } = req;
  const event = new Event({
    name: req.body.name,
    host: host,
    date: req.body.eventDate || req.body.date,
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
      res.json({ event: savedEvent.toJSONFor() });
    })
    .catch(next);
});

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
    Event.find(query)
      .limit(Number(limit))
      .skip(Number(offset))
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
        events: events.map(event => {
          console.log("this is an event in the map", event);
          if (req.auth && req.vippyHost) {
            return event.toJSONFor(req.vippyHost);
          }
          return event.toJSONFor(); // designed to be adjusted to return auth versions of events and listing objects within event
        }),
        eventsCount: eventsCount
      });
    })
    .catch(next);
});

module.exports = router;
