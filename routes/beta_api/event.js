var express = require('express');
var router = express.Router();
var querystring = require("querystring")
var request = require("request")


// auth middleware
var auth = require('../authMiddleware')

// models
var Event = require("../../models/Event")
var Host = require("../../models/Host")

// config
var config = require("./../../config")

router.post('/', auth.required, function(req, res, next) {
  const hostAuth = req.auth
  if (hostAuth.sub !== 'host') return res.status(403).json({ error: "You must be an Authenticated host" })
  console.log('the req.body at POST event/ endpoint is', req.body)

  Host.findById(hostAuth.id)
  .then((host) => {

    if (!host) {
      return res.status(401).json({ error: "You must be an Authenticated Host" })
    }
    const event = new Event({
      name: req.body.name,
      host: host._id,
      date: req.body.eventDate || req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      address: {
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip || req.body.zipcode,
      }
    })

    return event.save()
  })
  .then((event) => {
    res.json({ event })
  })
  .catch(next)
})

module.exports = router
