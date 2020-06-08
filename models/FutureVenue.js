var mongoose = require("mongoose");
var crypto = require("crypto");

const FutureVenueSchema = new mongoose.Schema(
  {
    accessCode: String,
    email: {
      type: String,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"]
    },
    venueName: { type: String }
  },
  { timestamps: true }
);

FutureVenueSchema.methods.setAccessCode = function() {
  this.accessCode = "new_venue_" + crypto.randomBytes(8).toString("hex");
};

const FutureVenue = mongoose.model("FutureVenue", FutureVenueSchema);

module.exports = FutureVenue;
