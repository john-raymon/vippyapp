var jwt = require("express-jwt");
var secret = require("../config").secret;

// models
var Host = require("../models/Host"),
  User = require("../models/User"),
  Promoter = require("../models/Promoter");

function getToken(req) {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}

var auth = {
  required: jwt({
    secret: secret,
    userProperty: "auth",
    getToken: getToken
  }),
  optional: jwt({
    secret: secret,
    userProperty: "auth",
    credentialsRequired: false,
    getToken: getToken
  }),
  onlyUser: function(req, res, next) {
    if (!req.vippyUser) {
      return next({
        name: "UnauthorizedError",
        message: "You are not logged in"
      });
    }
    next();
  },
  setUserOrHost: function(req, res, next) {
    const currentAuth = req.auth;
    if (!currentAuth) return next(); // doesn't return if no authentication. skips to next middleware on stack
    if (currentAuth.sub === "host") {
      Host.findById(currentAuth.id)
        .then(function(host) {
          if (!host) {
            return res
              .status(401)
              .json({ error: "You must be an Authenticated Host" });
          }

          req.vippyHost = host;
          next();
        })
        .catch(next);
    } else if (currentAuth.sub === "user") {
      User.findById(currentAuth.id)
        .then(function(user) {
          if (!user) {
            return res
              .status(401)
              .json({ error: "You must be an Authenticated User" });
          }

          req.vippyUser = user;
          next();
        })
        .catch(next);
    } else if (currentAuth.sub === "promoter") {
      Promoter.findById(currentAuth.id)
        .populate("venue")
        .exec()
        .then(function(promoter) {
          if (!promoter) {
            return res.status(401).json({
              success: false,
              error: "You must be an authenticated promoter"
            });
          }
          req.vippyPromoter = promoter;
          next();
        })
        .catch(next);
    }
  },
  hostOrPromoterMiddleware: function(doNotAllowPromoter = false) {
    if (doNotAllowPromoter) {
      return function hostMiddleware(req, res, next) {
        if (!req.auth) return next(); // doesn't return if no authentication. skips to next middleware on stack
        const hostAuth = req.auth;
        if (hostAuth.sub !== "host") {
          return next({
            name: "UnauthorizedError",
            message: "You must be logged in as a Host"
          });
        }
        Host.findById(hostAuth.id)
          .then(function(host) {
            if (!host) {
              return next({
                name: "UnauthorizedError",
                message: "You must be logged in as a Host"
              });
            }
            req.vippyHost = host;
            next();
          })
          .catch(next);
      };
    }
    return function hostPromoterMiddleware(req, res, next) {
      const hostAuth = req.auth;
      if (!req.auth) return next(); // doesn't return if no authentication. skips to next middleware on stack
      if (hostAuth.sub !== "host" && hostAuth.sub !== "promoter") {
        return next({
          name: "UnauthorizedError",
          message:
            "You must be logged in as the venue host, or promoter of belonging to the venue host"
        });
      }
      if (hostAuth.sub === "host") {
        Host.findById(hostAuth.id)
          .then(function(host) {
            if (!host) {
              return res
                .status(401)
                .json({ error: "You must be an Authenticated Host" });
            }
            req.vippyHost = host;
            next();
          })
          .catch(next);
      } else if (hostAuth.sub === "promoter") {
        Promoter.findById(hostAuth.id)
          .populate("venue")
          .exec()
          .then(function(promoter) {
            if (!promoter) {
              return next({
                name: "UnauthorizedError",
                message:
                  "You must be logged in as a promoter belonging to the venue host"
              });
            }
            req.vippyPromoter = promoter;
            next();
          })
          .catch(next);
      }
    };
  },
  onlyPromoterWithCreateUpdateEventsPermissions: function(req, res, next) {
    // this should be called after a hostOrPromoterMiddleware, or setUserOrHostPromoter middleware,since it depends on vippyPromoter to be on req object
    // only allow vippyPromoter with truthy permissions.createUpdateEvents property to create Events for their Venue Host
    if (
      req.vippyPromoter &&
      !req.vippyPromoter.permissions.createUpdateEvents
    ) {
      return next({
        name: "UnauthorizedError",
        message:
          "You do not have proper permissions to create or update Events, contact your Venue Host"
      });
    }
    return next();
  },
  onlyPromoterWithCreateUpdateListingsPermissions: function(req, res, next) {
    // this should be called after a hostOrPromoterMiddleware, or setUserOrHostPromoter middleware,since it depends on vippyPromoter to be on req object
    // only allow vippyPromoter with truthy permissions.createUpdateEvents property to create Events for their Venue Host
    if (
      req.vippyPromoter &&
      !req.vippyPromoter.permissions.createUpdateListings
    ) {
      return next({
        name: "UnauthorizedError", // todo: update to forbidden error as this more authoriation rather than authentication
        message:
          "You do not have proper permissions to create or update Listings, contact your Venue Host"
      });
    }
    return next();
  }
};

module.exports = auth;
