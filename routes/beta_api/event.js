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

router.get("/", auth.required, hostMiddleware, function(req, res, next) {
  const { vippyHost } = req;
  Event.find({ host: vippyHost._id })
    .populate("host")
    .populate("currentListings")
    .exec()
    .then(events => {
      res.json({ events: events.map((event, index) => event.toJSONFor()) });
    })
    .catch(next);
});

module.exports = router;
