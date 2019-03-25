var Passport = require("passport").Passport,
    userPassport = new Passport(),
    hostPassport = new Passport()
var LocalStategy = require("passport-local").Strategy
var mongoose = require("mongoose")
var User = require("../models/User")
var Host = require("../models/Host")

userPassport.use(new LocalStategy({
  usernameField: "user[email]",
  passwordField: "user[password]"
}, function(email, password, done) {
  User.findOne({ email: email }).then(function(user) {
    if (!user || !user.validPassword(password)) {
      return done(null, false, { errors: {'email or password': 'is invalid'} })
    }
    return done(null, user)
  }).catch(done)
}))

hostPassport.use(new LocalStategy({
  usernameField: "email",
  passwordField: "password"
}, function(email, password, done) {
  console.log('called@!! here!! inside local !!', email, password)
  Host.findOne({ email: email }).then(function(host) {
    if (!host || !host.validPassword(password)) {
      return done(null, false, { errors: {'email or password': 'is invalid'} })
    }
    return done(null, host)
  }).catch(done)
}))


module.exports = {
  hostPassport,
  userPassport
}
