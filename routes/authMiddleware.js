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
  }
};

module.exports = auth;
