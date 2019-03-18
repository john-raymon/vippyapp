var mongoose = require('mongoose')
var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var uniqueValidator = require('mongoose-unique-validator')

const HostSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, unique: true, required: [true, "is required"], match: [/\S+@\S+\.\S+/, "is invalid"] },
  fullname: { type: String, lowercase: true, unique: true, required: [true, "is required"]},
  zipcode: { type: String, required: [true, "is required"]},
  phonenumber: { type: String, unique: true, match: [ /d{10}/, "is not a valid 10 digit number"], required: [true, "is required"]},
  hash: String,
  salt: String
}, { timestamps: true })

HostSchema.plugin(uniqueValidator, { message: "is already taken" })

HostSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

HostSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash
}

HostScheme.methods.generateJWT = function() {
  const today = new Date()
  let exp = new Date(today)
  exp.setDate(today.getDate() + 30)

  return jwt.sign({
    sub: 'host',
    id: this._id,
    email: email,
    exp: parseInt(exp.getTime() / 1000)
  }, process.env.SECRET)
}
const Host = mongoose.model('Host', HostSchema)

module.exports = Host
