var express = require("express");
var router = express.Router();
var querystring = require("querystring");
var request = require("request");

// auth middleware
var auth = require("../authMiddleware");
var { hostMiddleware } = require("./host");

// models
var Promoter = require("../../models/Promoter");
var Host = require("../../models/Host");

// config
var config = require("./../../config");

// utils
var createId = require("./../../utils/createId");

router.post("/", auth.required, hostMiddleware, function(req, res, next) {
  const { vippyHost: host } = req;
  const promoter = new Promoter({
    username: req.body.username || createId(6),
    venue: host,
    venueId: host.venueId,
    fullname: req.body.fullname
  });

  promoter.setPassword(req.body.password);

  return promoter
    .save()
    .then(savedPromoter => {
      res.json({ promoter: savedPromoter.getPromoter() });
    })
    .catch(next);
});

router.get("/", auth.required, hostMiddleware, function(req, res, next) {
  const { vippyHost: host } = req;

  return Promise.all([
    Promoter.find({ venue: host._id }).exec(),
    Promoter.count({ venue: host._id }).exec()
  ])
    .then(([promoters, promoterCount]) => {
      return res.json({
        promoters: promoters.map(promoter => promoter.getPromoter()),
        promoterCount
      });
    })
    .catch(next);
});

module.exports = router;
