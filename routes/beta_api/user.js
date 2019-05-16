var express = require("express");
var router = express.Router();
var request = require("request");
var { parsePhoneNumber, ParseError } = require("libphonenumber-js");

// cloudinary
var cloudinary = require("cloudinary");

// auth middleware
var auth = require("../authMiddleware");

// cloudinary parser middleware
var imageParser = require("./../../config/multer-cloudinary");

// models
var User = require("../../models/User");

// passports
var { userPassport } = require("./../../config/passport");

// utils
var isBodyMissingProps = require("./../../utils/isBodyMissingProps");

// creating a new user, anyone can become a user, no admin middleware needed here
router.post(
  "/",
  function(req, res, next) {
    const requiredProps = [
      "email",
      "fullname",
      "zipcode",
      "phonenumber",
      "verification_code"
    ];

    const { hasMissingProps, propErrors } = isBodyMissingProps(
      requiredProps,
      req.body
    );
    if (hasMissingProps) {
      next({
        name: "ValidationError",
        errors: propErrors
      });
    }

    // we have all the requiredProps so continue
    const userNum = req.body.phonenumber;
    // validate phonenumber
    User.count({ email: req.body.email })
      .exec()
      .then(function(count) {
        if (count > 0) {
          return next({
            name: "ValidationError",
            errors: {
              email: { message: "is already taken" }
            }
          });
        }
        return count;
      })
      .then(function() {
        return new Promise((resolve, reject) => {
          try {
            const parsedPhoneNumber = parsePhoneNumber(userNum, "US");
            if (!parsedPhoneNumber.isValid()) {
              return res.status(400).json({
                success: true,
                error: "The phone number is not valid"
              });
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
                reject({ name: "BadRequestError", message: body.message });
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
        req.vippyUser = user;
        next();
        // return user.save().then(function() {
        //   return res.json({ success: true, user: user.toAuthJSON() });
        // });
      })
      .catch(next);
  },
  imageParser.single("userImage"),
  function(req, res, next) {
    if (req.file) {
      const newImage = {
        url: req.file.url,
        public_id: req.file.public_id
      };
      req.vippyUser.image = newImage;
    }
    return req.vippyUser
      .save()
      .then(function(user) {
        return res.json({ success: true, user: user.toAuthJSON() });
      })
      .catch(next);
  }
);

router.patch(
  "/",
  auth.required,
  auth.setUserOrHost,
  auth.onlyUser,
  imageParser.single("userImage"),
  async function(req, res, next) {
    const whitelistedKeys = ["fullname", "zipcode"];

    for (let prop in req.body) {
      if (whitelistedKeys.includes(prop)) {
        req.vippyUser[prop] = req.body[prop];
      }
    }

    if (req.body.email && req.vippyUser.email !== req.body.email) {
      // send security confirmation email below
      // and reset isEmailConfirmed
      // ...
      req.vippyUser.email = req.body.email;
      req.vippyUser.isEmailConfirmed = false;
    }
    if (req.body.phonenumber) {
      try {
        if (!req.body.verificationCode) {
          throw {
            name: "ValidationError",
            message: "Your verification code is required"
          };
        }
        const parsedPhoneNumber = parsePhoneNumber(req.body.phonenumber, "US");
        if (!parsedPhoneNumber.isValid()) {
          throw {
            name: "BadRequestError",
            message: "The phone number is not valid"
          };
        }
        const nationalNumber = parsedPhoneNumber.nationalNumber;
        const countryCallingCode = parsedPhoneNumber.countryCallingCode;

        const twilioRequest = await new Promise((resolve, reject) => {
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
                return reject({
                  name: "BadRequestError",
                  message: body.message
                });
              }
              // if verification was successful then resolve promise with twilio response body, and create the account
              resolve([body, nationalNumber, countryCallingCode]);
            }
          );
        });

        const [twilioRes] = twilioRequest;
        if (twilioRes.success) {
          req.vippyUser.phonenumber = nationalNumber;
          req.vippyUser.countryCallingCode = countryCallingCode;
          req.vippyUser.phoneVerified = true;
        }
      } catch (error) {
        if (error instanceof ParseError) {
          return next({
            name: "BadRequestError",
            message: "The phone number may be invalid"
          });
        }
        return next(error);
      }
    }

    if (req.body.password) {
      // send security email to user
      req.vippyUser.setPassword(req.body.password);
    }

    if (req.file) {
      try {
        const newImage = {
          url: req.file.url,
          public_id: req.file.public_id
        };
        console.log("the current type of the is", req.vippyUser.image.publicId);
        if (
          req.vippyUser.image.public_id !== undefined ||
          typeof req.vippyUser.image.publicId !== "undefined"
        ) {
          const publicId = req.vippyUser.image.public_id;
          const destroyImage = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(publicId, {}, (error, result) => {
              if (error) reject(error);
              resolve(result);
            });
          });
        }
        req.vippyUser.image = newImage;
      } catch (err) {
        return next(err);
      }
    }

    req.vippyUser
      .save()
      .then(function(user) {
        return res.json({
          success: true,
          user: user.toProfileJSON()
        });
      })
      .catch(next);
  }
);

router.post("/login", function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    return res.status(422).json({
      success: false,
      error: "email and password are required to login"
    });
  }

  userPassport.authenticate("local", function(err, user, data) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(422).json(data);
    }
    return res.json({ success: true, user: user.toAuthJSON() });
  })(req, res, next);
});

module.exports = router;
