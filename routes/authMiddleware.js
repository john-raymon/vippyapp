var jwt = require("express-jwt");
var secret = require("../config").secret;

// models
var Host = require("../models/Host"),
  User = require("../models/User");

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
    const hostAuth = req.auth;
    if (!hostAuth) return next();
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
    } else if (hostAuth.sub === "user") {
      User.findById(hostAuth.id)
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
    }
  }
};

module.exports = auth;
