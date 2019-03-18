var mongoose = require('mongoose')
var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var uniqueValidator = require('mongoose-unique-validator')

const HostSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, unique: true, required: [true, "is required"], match: [/\S+@\S+\.\S+/, "is invalid"] },
  fullname: { type: String, lowercase: true, unique: true, required: [true, "is required"]},
  zipcode: { type: String, required: [true, "is required"]},
  phonenumber: {
    type: Number,
    unique: true,
    validate: [
      function validator(n) {
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(n);
      },
      'This is not a valid 10 digit number'
    ],
    required: [ true, "is required" ]
  },
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

HostSchema.methods.generateJWT = function() {
  const today = new Date()
  let exp = new Date(today)
  exp.setDate(today.getDate() + 30)

  return jwt.sign({
    sub: 'host',
    id: this._id,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000)
  }, process.env.SECRET)
}

HostSchema.methods.toAuthJSON = function() {
  return {
    username: this.email,
    zipcode: this.zipcode,
    fullname: this.fullname,
    phonenumber: this.phonenumber,
    token: this.generateJWT()
  }
}

const Host = mongoose.model('Host', HostSchema)

module.exports = Host
