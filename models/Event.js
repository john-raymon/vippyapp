var mongoose = require("mongoose");

// Host model
var Host = require("./Host");

// Listing model
var Listing = require("./Listing");

var EventSchema = mongoose.Schema({
  name: { type: String, required: [true, "is required"] },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "Host" },
  currentListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  date: { type: Date, required: [true, "is required"] },
  startTime: { type: Date, required: [true, "is required"] },
  endTime: { type: Date, required: [true, "is required"] },
  address: {
    street: { type: String, required: [true, "is required"] },
    city: { type: String, required: [true, "is required"] },
    state: { type: String, required: [true, "is required"] },
    zip: { type: String, required: [true, "is required"] }
  }
});

EventSchema.methods.toJSONFor = function(user) {
  const {
    name,
    host,
    currentListings,
    date,
    startTime,
    endTime,
    address,
    _id: id
  } = this;

  return {
    id,
    name,
    host: host.toProfileJSON(),
    currentListings: currentListings.map(function(listing, index) {
      console.log("the listing is now !!!!! -->", listing);
      return listing.toJSONForHost(user);
      // return listing
    }),
    // currentListings: currentListings,
    date,
    startTime,
    endTime,
    address
  };
};

EventSchema.methods.toJSONForListing = function() {
  const {
    name,
    host,
    currentListings,
    date,
    startTime,
    endTime,
    address,
    _id: id
  } = this;

  return {
    id,
    name,
    host: host.toProfileJSON(),
    date,
    startTime,
    endTime,
    address
  };
};

var Event = mongoose.model("Event", EventSchema);

module.exports = Event;
