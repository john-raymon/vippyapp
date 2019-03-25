var express = require('express');
var router = express.Router();
var querystring = require("querystring")
var request = require("request")


// auth middleware
var auth = require('../authMiddleware')

// models
var Host = require("../../models/Host")

// config
var config = require("./../../config")

// passports
var { hostPassport } = require("./../../config/passport")

router.post('/', function(req, res, next) {
  console.log('the req is', req.body)
  const host = new Host({
    email: req.body.email,
    fullname: req.body.fullname,
    zipcode: req.body.zipcode,
    phonenumber: req.body.phonenumber
  })

  host.setPassword(req.body.password)

  host.save().then(function() {
    return res.json({ user: host.toAuthJSON()})
  }).catch(next)
})

router.post('/login', function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.status(422).json({errors: {"email and password": "are required to login"}})
  }

  hostPassport.authenticate('local', function(err, host, data) {

    if (err) {
      return next(err)
    }

    if (!host) {
      return res.status(422).json(data)
    }
    return res.json({ host: host.toAuthJSON() })
  })(req, res, next)
})


// stripe

router.post('/stripe/auth', auth.required, function(req, res, next) {
  const hostAuth = req.auth
  if (hostAuth.sub !== 'host') return res.status(403).json({ error: "You must be an Authenticated host" })
  Host.findById(hostAuth.id).then(function(host) {

    if (!host) {
      return res.status(401).json({ error: "You must be an Authenticated Host" })
    }

    if (host.hasStripeId()) {
      return res.status(403).json({ error: "You have already connected this account to a Stripe account" })
    }

    host.createRandomKey().then((key) => {
      let parameters = {
        client_id: config.stripe.client_id,
        state: key,
        redirect_uri: config.public_domain + '/api/host/stripe/token',
        'stripe_user[business_type]': host.type || 'individual',
        'stripe_user[business_name]': host.business_name || undefined,
        'stripe_user[first_name]': host.fullname.split(" ")[0] || undefined,
        'stripe_user[last_name]': host.fullname.split(" ")[1] || undefined,
        'stripe_user[email]': host.email || undefined,
        'stripe_user[phone_number]': host.phonenumber || undefined
        // If we're suggesting this account have the `card_payments` capability,
        // we can pass some additional fields to prefill:
        // 'suggested_capabilities[]': 'card_payments',
        // 'stripe_user[street_address]': req.user.address || undefined,
        // 'stripe_user[city]': req.user.city || undefined,
        // 'stripe_user[zip]': req.user.postalCode || undefined,
        // 'stripe_user[state]': req.user.city || undefined,
        // 'stripe_user[country]': req.user.country || undefined
      }

      console.log('Starting Express flow:', parameters);

      res.json({res:
        config.stripe.authorizeUri + '?' + querystring.stringify(parameters)
      });
    }).catch(next)
  }).catch(next)
})

router.get("/stripe/token", auth.optional, function(req, res, next) { // usually not optional, will be required when jwt can be picked up on redirect
  const hostAuth = req.auth
  // if (hostAuth.sub !== 'host') return res.status(403).json({error: Error("You must be an Authenticated Host") })
  Host.findOne({ randomKey: req.query.state }).then(function(host) { // usually will look for host using data from auth host such as hostAuth.id
    if (!host) {
      return res.status(401).json({ error: "You must be an Authenticated Host"})
    }

    if (host.hasStripeId()) {
      return res.status(403).json({ error: "You have already connected this account to a Stripe account"})
    }

    // make request to Stripe tokenUri with access code received from Stripe to receive Host's stripe_user_id
    request.post(
      config.stripe.tokenUri,
      {
        form: {
          grant_type: 'authorization_code',
          client_secret: config.stripe.secret_key,
          code: req.query.code
        },
        json: true
      },
      (err, response, body) => {
        if (err || body.errer) {
          res.redirect("/onBoardingError") // front-end page explaining the fallout, telling the user to attempt the process again
        }
        // update the host model with the stripe_user_id
        host.stripeAccountId = body.stripe_user_id
        host.save().then(() => {
          res.json({ host: host.toJSON()})
        }).catch(next)
      }
    )
  }).catch(next)
})

module.exports = router
