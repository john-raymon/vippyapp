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

// auth passports
var { promoterPassport } = require("./../../config/passport");

// utils
var createId = require("./../../utils/createId");
var isBodyMissingProps = require("./../../utils/isBodyMissingProps");

// create a promoter only venue host can create a promoter
router.post("/", auth.required, hostMiddleware, function(req, res, next) {
  const { vippyHost: host } = req;

  const requiredProps = [
    "password",
    "createUpdateEvents",
    "createUpdateListings",
    "fullname"
  ];
  const { hasMissingProps, propErrors } = isBodyMissingProps(
    requiredProps,
    req.body
  );
  if (hasMissingProps) {
    next({
      name: "ValidationError",
      errors: propErrors
    });
  }

  Promoter.count({ username: req.body.username })
    .exec()
    .then(function(count) {
      if (count > 0) {
        return next({
          name: "ValidationError",
          errors: {
            username: { message: "is already taken" }
          }
        });
      }
      return count;
    });
  const promoter = new Promoter({
    username: req.body.username || createId(6),
    venue: host,
    venueId: host.venueId,
    fullname: req.body.fullname,
    permissions: {
      createUpdateEvents: req.body.createUpdateEvents,
      createUpdateListings: req.body.createUpdateListings
    }
  });

  promoter.setPassword(req.body.password);

  return promoter
    .save()
    .then(savedPromoter => {
      res.json({ success: true, promoter: savedPromoter.getPromoter() });
    })
    .catch(next);
});

// authenticate a promoter
router.post("/login", function(req, res, next) {
  const requiredProps = ["username", "password", "venueId"];
  const { hasMissingProps, propErrors } = isBodyMissingProps(
    requiredProps,
    req.body
  );
  if (hasMissingProps) {
    next({
      name: "ValidationError",
      errors: propErrors
    });
  }

  promoterPassport.authenticate("local", function(err, promoter, data) {
    // handle for errors
    if (err) {
      return next(err);
    }

    if (!promoter) {
      return res.status(422).json({
        success: false,
        error: data
      });
    }

    return res.json({
      success: true,
      promoter: promoter.getAuthPromoter()
    });
  })(req, res, next);
});

// get all promoters for authorized venue host, only venue host can view all promoters
router.get("/", auth.required, hostMiddleware, function(req, res, next) {
  const { vippyHost: host } = req;

  return Promise.all([
    Promoter.find({ venue: host._id }).exec(),
    Promoter.count({ venue: host._id }).exec()
  ])
    .then(([promoters, promoterCount]) => {
      return res.json({
        success: true,
        promoters: promoters.map(promoter => promoter.getPromoter()),
        promoterCount
      });
    })
    .catch(next);
});

// only venue host can update a promoter
// we're only querying for promoters with matching venueId as host
router.patch("/:promoterUsername", auth.required, hostMiddleware, function(
  req,
  res,
  next
) {
  if (!req.params.promoterUsername) {
    return next({
      name: "ValidationError",
      errors: {
        username: { message: "The promoter username is required" }
      }
    });
  }
  const { promoterUsername } = req.params;
  const whitelistedKeys = [
    "username",
    "password",
    "fullname",
    "createUpdateEvents",
    "createUpdateListings"
  ];
  Promoter.findOne({
    username: promoterUsername,
    venueId: req.vippyHost.venueId
  })
    .then(promoter => {
      if (!promoter) {
        res.status(404).json({
          success: false,
          errors: {
            promoter: {
              message: `Promoter with username ${promoterUsername} does not exist`
            }
          }
        });
      }
      for (let prop in req.body) {
        if (
          whitelistedKeys.includes(prop) &&
          prop !== "username" &&
          prop !== "password" &&
          (prop !== "createUpdateListings" && prop !== "createUpdateListings")
        ) {
          promoter[prop] = req.body[prop];
        }
      }

      if (req.body.username && promoter.username !== req.body.username) {
        // send security confirmation email below
        // and reset isEmailConfirmed
        // ...
        promoter.username = req.body.username;
      }

      if (req.body.password) {
        // send security email to host
        promoter.setPassword(req.body.password);
      }

      if (
        req.body.createUpdateEvents !== undefined ||
        typeof req.body.createUpdateEvents !== "undefined"
      ) {
        promoter.permissions.createUpdateEvents = req.body.createUpdateEvents;
      }

      if (
        req.body.createUpdateListings !== undefined ||
        typeof req.body.createUpdateListings !== "undefined"
      ) {
        promoter.permissions.createUpdateListings =
          req.body.createUpdateListings;
      }

      return promoter.save();
    })
    .then(function(promoter) {
      return res.json({ success: true, promoter: promoter.getPromoter() });
    })
    .catch(next);
});
module.exports = router;
