var express = require('express');
var router = express.Router();

// models
var Host = require("../../models/Host")

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

module.exports = router
