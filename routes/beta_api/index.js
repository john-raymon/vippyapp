var express = require('express');
var router = express.Router();

router.use('/host', require('./host'));
router.use('/user', require('./user'));

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

  next(err)
})

module.exports = router;
