var express = require('express');
var router = express.Router();

router.use('/host', require('./host'));
router.use('/user', require('./user'));
router.use('/event', require('./event'))

// error handler; catches ValidationErrors, otherwise calls next errorhandler in stack
router.use(function(err, req, res, next) {

  if (err.name === "ValidationError") {

    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message

        return errors;
      },{})
    })
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: {"Authentication": "You must be authenticated as a host" }})
  }

  next(err)
})

module.exports = router;
