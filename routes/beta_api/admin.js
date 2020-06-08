var express = require("express");
var router = express.Router();

var FutureVenue = require("../../models/FutureVenue");

router.post("/venue-access", function(req, res, next) {
  if (
    (req.body.masterAdminKey || req.body.masterKey) !==
      process.env.MASTER_ADMIN_KEY ||
    req.body.masterAdminEmail ||
    req.body.masterEmail !== process.env.MASTER_ADMIN_EMAIL
  ) {
    // if master key doesn't match then throw unauthorized error
    // TODO : report this log this somewhere for security reasons, could be someone attempting to hack into admin
    // endpoint
    throw {
      name: "ValidationError",
      message: "Master admin credentials invalid."
    };
  }

  if (!req.body.email && !req.body.venueEmail) {
    throw {
      name: "ValidationError",
      message:
        "You must provide the email for the venue's account. Optionally a venue name through 'venueName' can be provided."
    };
  }
  const futureVenue = new FutureVenue({
    email: req.body.email || req.body.venueEmail,
    venueName: req.body.venueName
  });

  futureVenue.setAccessCode();

  futureVenue.save().then(function() {
    return res.json({
      success: true,
      futureVenue: futureVenue.toJSON()
    });
  });
});

module.exports = router;
