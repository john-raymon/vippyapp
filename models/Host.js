var mongoose = require('mongoose')
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

mongoose.model('Host', HostSchema)
