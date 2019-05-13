var express = require("express");
var router = express.Router();
var querystring = require("querystring");
var request = require("request");
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// auth middleware
var auth = require("../authMiddleware");
var hostMiddleware = auth.hostOrPromoterMiddleware(true); // true to set doNotAllowPromoter

// models
var Host = require("../../models/Host");
var Promoter = require("../../models/Promoter");

// config
var config = require("./../../config");

// passports
var { hostPassport } = require("./../../config/passport");

// utils
var createId = require("./../../utils/createId");
var isBodyMissingProps = require("./../../utils/isBodyMissingProps");

// get all Venues, authentication not required
router.get("/", auth.optional, auth.setUserOrHost, function(req, res, next) {
  return Promise.all([
    Host.find({ isEmailConfirmed: true }).exec(),
    Host.count({ isEmailConfirmed: true }).exec()
  ])
    .then(([hosts, hostCount]) => {
      return res.json({
        venues: hosts.map(host => host.toProfileJSON()),
        venueCount: hostCount
      });
    })
    .catch(next);
});

// Update hosts
router.patch("/", auth.required, hostMiddleware, function(req, res, next) {
  const whitelistedKeys = [
    "venueName",
    "fullname",
    "phonenumber",
    "email",
    "password"
  ];
  for (let prop in req.body) {
    if (
      whitelistedKeys.includes(prop) &&
      prop !== "email" &&
      prop !== "password"
    ) {
      req.vippyHost[prop] = req.body[prop];
    }
    continue;
  }

  if (req.body.email && req.vippyHost.email !== req.body.email) {
    // send security confirmation email below
    // and reset isEmailConfirmed
    // ...
    req.vippyHost.email = req.body.email;
    req.vippyHost.isEmailConfirmed = false;
  }

  if (req.body.password) {
    // send security email to host
    req.vippyHost.setPassword(req.body.password);
  }

  req.vippyHost
    .save()
    .then(function(host) {
      return res.json({ venueHost: host._toJSON() });
    })
    .catch(next);
});

// Create a new Host - add admin middleware to prevent Host from being created without permission
router.post("/", function(req, res, next) {
  const requiredProps = [
    "email",
    "venueName",
    "phonenumber",
    "fullname",
    "zipcode"
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

  const host = new Host({
    email: req.body.email,
    fullname: req.body.fullname,
    zipcode: req.body.zipcode,
    phonenumber: req.body.phonenumber,
    venueId: createId(5),
    venueName: req.body.venueName
  });

  host.setPassword(req.body.password);

  host
    .save()
    .then(function() {
      return res.json({ venueHost: host.toAuthJSON() });
    })
    .catch(next);
});

// login and authenticate Host
router.post("/login", function(req, res, next) {
  const requiredProps = ["email", "password"];

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

  hostPassport.authenticate("local", function(err, host, data) {
    if (err) {
      return next(err);
    }

    if (!host) {
      return res.status(422).json(data);
    }

    return Promise.all([
      Promoter.find({ venue: host._id }).exec(),
      Promoter.count({ venue: host._id }).exec()
    ])
      .then(([promoters, promoterCount]) => {
        return res.json({
          host: {
            ...host.toAuthJSON(),
            promoters: promoters.map(promoter => promoter.getPromoter()),
            promoterCount
          }
        });
      })
      .catch(next);
  })(req, res, next);
});

// stripe
router.post("/stripe/auth", auth.required, hostMiddleware, function(
  req,
  res,
  next
) {
  const hostAuth = req.auth;

  Host.findById(hostAuth.id)
    .then(function(host) {
      if (!host) {
        return next({
          name: "UnauthorizedError",
          message: "You must be an authenticated host"
        });
      }

      if (host.hasStripeId()) {
        return next({
          name: "UnauthorizedError",
          message: "You have already connected this account to a Stripe account"
        });
      }

      host
        .createRandomKey()
        .then(key => {
          let parameters = {
            client_id: config.stripe.client_id,
            state: key,
            redirect_uri: config.public_domain + "/api/host/stripe/token",
            "stripe_user[business_type]": host.type || "individual",
            "stripe_user[business_name]": host.business_name || undefined,
            "stripe_user[first_name]": host.fullname.split(" ")[0] || undefined,
            "stripe_user[last_name]": host.fullname.split(" ")[1] || undefined,
            "stripe_user[email]": host.email || undefined,
            "stripe_user[phone_number]": host.phonenumber || undefined
            // If we're suggesting this account have the `card_payments` capability,
            // we can pass some additional fields to prefill:
            // 'suggested_capabilities[]': 'card_payments',
            // 'stripe_user[street_address]': req.user.address || undefined,
            // 'stripe_user[city]': req.user.city || undefined,
            // 'stripe_user[zip]': req.user.postalCode || undefined,
            // 'stripe_user[state]': req.user.city || undefined,
            // 'stripe_user[country]': req.user.country || undefined
          };

          console.log("Starting Express flow:", parameters);

          res.json({
            res:
              config.stripe.authorizeUri +
              "?" +
              querystring.stringify(parameters)
          });
        })
        .catch(next);
    })
    .catch(next);
});

// stripe on-boarding returns venue host back through here
router.get("/stripe/token", auth.optional, function(req, res, next) {
  // usually not optional, will be required when jwt can be picked up on redirect
  const hostAuth = req.auth;
  // if (hostAuth.sub !== 'host') return res.status(403).json({error: Error("You must be an Authenticated Host") })
  Host.findOne({ randomKey: req.query.state })
    .then(function(host) {
      // usually will look for host using data from auth host such as hostAuth.id
      if (!host) {
        return next({
          name: "UnauthorizedError",
          message: "You must be an authenticated host"
        });
      }

      if (host.hasStripeId()) {
        return res.status(403).json({
          error: "You have already connected this account to a Stripe account"
        });
      }

      // make request to Stripe tokenUri with access code received from Stripe to receive Host's stripe_user_id
      request.post(
        config.stripe.tokenUri,
        {
          form: {
            grant_type: "authorization_code",
            client_secret: config.stripe.secret_key,
            code: req.query.code
          },
          json: true
        },
        (err, response, body) => {
          if (err || body.error) {
            res.redirect("/onBoardingError"); // front-end page explaining the fallout, telling the user to attempt the process again
          }
          // update the host model with the stripe_user_id
          host.stripeAccountId = body.stripe_user_id;

          host
            .save()
            .then(host => {
              host.createRandomKey().then(key => {
                return res.json({
                  success: "true",
                  host: host._toJSON()
                }); // when front-end is implemented instead redirect to dashboard, that will handle for stripe being authenticated already
              });
            })
            .catch(next);
        }
      );
    })
    .catch(next);
});

router.get("/stripe/dashboard", auth.required, auth.setUserOrHost, function(
  req,
  res,
  next
) {
  if (req.vippyHost) {
    if (!req.vippyHost.hasStripeId()) {
      return res.status(400).json({
        error: "You must have authenticate your account with Stripe",
        redirectTo: "HOST_DASHBOARD"
      });
    }

    stripe.accounts
      .createLoginLink(req.vippyHost.stripeAccountId)
      .then(loginLink => {
        res.redirect(loginLink.url);
      })
      .catch(next);
  }
});

module.exports = {
  router,
  hostMiddleware
};
