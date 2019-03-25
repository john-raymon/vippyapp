var express = require('express');
var router = express.Router();

// models
var User = require("../../models/User")

// passports
var { userPassport } = require("./../../config/passport")

router.post('/', function(req, res, next) {
  console.log('the req is', req.body)
  const user = new User({
    email: req.body.email,
    fullname: req.body.fullname,
    zipcode: req.body.zipcode,
    phonenumber: req.body.phonenumber
  })

  user.setPassword(req.body.password)

  user.save().then(function() {
    return res.json({ user: user.toAuthJSON()})
  }).catch(next)
})

router.post('/login', function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.status(422).json({errors: {"email and password": "are required to login"}})
  }

  userPassport.authenticate('local', function(err, user, data) {

    if (err) {
      return next(err)
    }

    if (!user) {
      return res.status(422).json(data)
    }
    return res.json({ user: user.toAuthJSON() })
  })(req, res, next)
})

module.exports = router
