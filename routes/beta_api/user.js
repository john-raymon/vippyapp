var express = require("express");
var router = express.Router();
var request = require("request");
var { parsePhoneNumber, ParseError } = require("libphonenumber-js");

// models
var User = require("../../models/User");

// passports
var { userPassport } = require("./../../config/passport");

router.post("/", function(req, res, next) {
  const requiredProps = [
    "email",
    "fullname",
    "zipcode",
    "phonenumber",
    "verification_code"
  ];
  let isBodyMissingProperty = false;

  const propErrors = requiredProps.reduce((errors, prop) => {
    if (!req.body[prop]) {
      isBodyMissingProperty = true;
      errors[prop] = `is required`;
    }
    return errors;
  }, {});

  if (isBodyMissingProperty) {
    return res.status(400).json({ errors: propErrors });
  }
  // we have all the requiredProps so continue
  const userNum = req.body.phonenumber;
  // validate phonenumber
  User.count({ email: req.body.email })
    .exec()
    .then(function(count) {
      if (count > 0) {
        throw {
          name: "ValidationError",
          errors: {
            email: { message: "is already taken" }
          }
        };
      }
      return count;
    })
    .then(function() {
      return new Promise((resolve, reject) => {
        try {
          const parsedPhoneNumber = parsePhoneNumber(userNum, "US");
          if (!parsedPhoneNumber.isValid()) {
            return res
              .status(400)
              .json({ error: "The phone number is not valid" });
          }
          resolve(parsedPhoneNumber);
        } catch (error) {
          if (error instanceof ParseError) {
            return res
              .status(400)
              .json({ error: "The phone number may be invalid" });
          }
          reject(error);
        }
      });
    })
    .then(parsedPhoneNumber => {
      const nationalNumber = parsedPhoneNumber.nationalNumber;
      const countryCallingCode = parsedPhoneNumber.countryCallingCode;
      // now that phone number is still valid, we don't need to check if the number is unregistered because if they were able to initiate
      // a twilio verification through the /twilio/send-onboard-code endpoint, then they were able to verify that the phone number
      // is unregistered, so we don't have to worry about that at this point, we just need to attempt to verfiy with the code,
      // if it succeeds then proceed to create the account for the user
      return new Promise((resolve, reject) => {
        request(
          {
            url:
              "https://api.authy.com/protected/json/phones/verification/check",
            method: "GET",
            headers: {
              "X-Authy-API-Key": process.env.TWILIO_ACCOUNT_SECURITY_API_KEY
            },
            qs: {
              verification_code: req.body.verification_code,
              phone_number: nationalNumber,
              country_code: countryCallingCode
            },
            json: true
          },
          function(err, response, body) {
            if (!body.success) {
              console.log("the body is", body);
              return res.status(400).json({ error: body.message });
            }
            // if verification was successful then resolve promise with twilio response body, and create the account
            resolve([body, nationalNumber, countryCallingCode]);
          }
        );
      });
    })
    .then(([twilioRes, nationalNumber, countryCallingCode]) => {
      console.log("nationalNumber is", nationalNumber);
      const user = new User({
        email: req.body.email,
        fullname: req.body.fullname,
        zipcode: req.body.zipcode,
        phonenumber: nationalNumber,
        countryCallingCode: countryCallingCode,
        phoneVerified: true
      });

      user.setPassword(req.body.password);

      return user.save().then(function() {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

router.post("/login", function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.status(422).json({ error: "email and password are required to login" });
  }

  userPassport.authenticate("local", function(err, user, data) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(422).json(data);
    }
    return res.json({ user: user.toAuthJSON() });
  })(req, res, next);
});

module.exports = router;
