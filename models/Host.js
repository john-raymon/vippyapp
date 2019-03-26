var mongoose = require("mongoose");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var uniqueValidator = require("mongoose-unique-validator");
var secret = require("../config").secret;

const HostSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "is required"],
      match: [/\S+@\S+\.\S+/, "is invalid"]
    },
    fullname: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "is required"]
    },
    zipcode: { type: String, required: [true, "is required"] },
    phonenumber: {
      type: Number,
      unique: true,
      validate: [
        function validator(n) {
          return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
            n
          );
        },
        "This is not a valid 10 digit number"
      ],
      required: [true, "is required"]
    },
    type: {
      type: String,
      default: "individual",
      enum: ["individual", "company"]
    },
    stripeAccountId: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    salt: String,
    hash: String,
    randomKey: String
  },
  { timestamps: true }
);

HostSchema.plugin(uniqueValidator, { message: "is already taken" });

HostSchema.methods.addProduct = function(id) {
  if (this.products.indexOf(id) === -1) {
    this.products.push(id);
  }
};

HostSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

HostSchema.methods.validPassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

HostSchema.methods.toProfileJSON = function() {
  return {
    id: this._id,
    zipcode: this.zipcode,
    firstname: this.fullname.split(" ")[0],
    type: "host"
  };
};

HostSchema.methods.createRandomKey = function() {
  crypto.randomBytes(48, (err, buffer) => {
    this.randomKey = buffer.toString("hex");
  });
  return this.save().then(() => {
    return this.randomKey;
  });
};

HostSchema.methods.generateJWT = function() {
  const today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 30);

  return jwt.sign(
    {
      sub: "host",
      id: this._id,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

HostSchema.methods.hasStripeId = function() {
  if (
    (typeof this.stripeAccountId === "string" &&
      !this.stripeAccountId.trim().length) ||
    this.stripeAccountId === null ||
    !this.stripeAccountId
  ) {
    return false;
  }
  return true;
};

HostSchema.methods.toAuthJSON = function() {
  return {
    username: this.email,
    zipcode: this.zipcode,
    fullname: this.fullname,
    phonenumber: this.phonenumber,
    type: "host",
    token: this.generateJWT(),
    completedPayment: this.hasStripeId()
  };
};

HostSchema.methods._toJSON = function() {
  return {
    username: this.email,
    zipcode: this.zipcode,
    fullname: this.fullname,
    phonenumber: this.phonenumber,
    type: "host",
    completedPayment: this.hasStripeId()
  };
};

const Host = mongoose.model("Host", HostSchema);

module.exports = Host;
