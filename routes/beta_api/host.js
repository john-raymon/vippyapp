var express = require('express');
var router = express.Router();

// models
var Host = require("../../models/Host")

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

module.exports = router
