var express = require("express");
var router = express.Router();

router.use("/host", require("./host").router);
router.use("/promoters", require("./promoters"));
router.use("/user", require("./user"));
router.use("/event", require("./event"));
router.use("/listing", require("./listing"));
router.use("/reservation", require("./reservation"));
router.use("/phone", require("./twilio").router);
router.use("/admin", require("./admin"));
// error handler; catches ValidationErrors, UnauthorizedErrors, otherwise calls next errorhandler in stack
router.use(function(err, req, res, next) {
  // we try to catch all errors below
  if (err.name === "ValidationError") {
    if (Object.entries(err.errors || {}).length === 0) {
      return res.status(422).json({
        success: false,
        name: "ValidationError",
        message: err.message,
        ...err
      });
    }
    return res.status(422).json({
      success: false,
      name: "ValidationError",
      errors: Object.keys(err.errors).reduce(function(errors, key) {
        const currentError = err.errors[key];
        errors[key] =
          currentError.kind === "mongoose-unique-validator"
            ? currentError.path === "phonenumber"
              ? "This phone number belongs to an existing account."
              : `This ${currentError.path} belongs to an existing account.`
            : currentError.message;

        return errors;
      }, {})
      // reduce to values to be only string from respective error's message rather than
      // entire ValidationError
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      errors: {
        authentication: {
          message: err.message || "You must be logged in"
        }
      }
    });
  }

  if (err.name === "BadRequestError" || err.name === "BadRequest") {
    return res.status(400).json({
      name: err.name,
      success: false,
      error: err.message
    });
  }
  // if not caught above they then passed below which then goes to root app.js
  next(err);
});

module.exports = router;
