const mongoose = require("mongoose");
const isFuture = require("date-fns/is_future");

// Host model
var Host = require("./Host");

// Listing model
var Listing = require("./Listing");

var EventSchema = mongoose.Schema({
  name: { type: String, required: [true, "is required"] },
  organizer: { type: String },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "Host" },
  currentListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  date: { type: Date, required: [true, "is required"] },
  startTime: { type: Date, required: [true, "is required"] },
  endTime: { type: Date, required: [true, "is required"] },
  address: {
    venueName: { type: String, required: [true, "The venue name is required"] },
    street: {
      type: String,
      required: [true, "A street address for the event is required"]
    },
    city: {
      type: String,
      required: [true, "A city for the event is required"]
    },
    state: {
      type: String,
      required: [true, "A state for the event is required"]
    },
    zip: {
      type: String,
      required: [true, "A zipcode for the event is required"]
    }
  },
  venueId: {
    type: String,
    index: true
  },
  images: {
    type: Map,
    of: {
      url: String,
      public_id: { type: String, index: true }
    },
    default: new Map()
  },
  cancelled: {
    type: Boolean,
    default: false
  }
});

EventSchema.methods.toJSONFor = function(user) {
  // TODO: refactor logic in this method
  const isVenuesEvent = user && user._id.equals(this.host.id);
  // user argument is utilized when invoking listing.toJSONForHost method vvv read comment below next to invocation
  const {
    organizer,
    name,
    host,
    currentListings,
    date,
    startTime,
    endTime,
    address,
    images,
    cancelled,
    venueId,
    _id: id
  } = this;

  let totalReservations = 0;
  let totalListingQuantityLeft = 0;

  const currentListingsTransformed = currentListings.map(function(
    listing,
    index
  ) {
    // toJSONForHost will check if user is not Host and instead return unAuth version of listing object
    if (isVenuesEvent) {
      totalReservations =
        totalReservations + listing.currentReservations.length;
      if (!listing.unlimitedQuantity) {
        totalListingQuantityLeft = totalListingQuantityLeft + listing.quantity;
      }
    }
    return listing.toJSONForHost(user);
  });

  if (isVenuesEvent) {
    return {
      id,
      name,
      host: host ? host.toProfileJSON() : host, // falls back to undefined/null host just in case deleted host document which should never occur unless in dev
      currentListings: currentListingsTransformed,
      date,
      totalReservations,
      totalListingQuantityLeft,
      startTime,
      endTime,
      address,
      images,
      cancelled,
      venueId,
      organizer
    };
  }
  return {
    id,
    name,
    host: host ? host.toProfileJSON() : host, // falls back to undefined/null host just in case deleted host document which should never occur unless in dev
    currentListings: currentListingsTransformed,
    date,
    startTime,
    endTime,
    address,
    images,
    cancelled,
    venueId,
    organizer
  };
};

EventSchema.methods.toNestedJSON = function() {
  const {
    organizer,
    venueId,
    name,
    host,
    currentListings,
    date,
    startTime,
    endTime,
    address,
    images,
    cancelled,
    _id: id
  } = this;

  return {
    id,
    name,
    host: host ? host.toProfileJSON() : host,
    date,
    startTime,
    endTime,
    address,
    images,
    cancelled,
    venueId,
    organizer
  };
};

EventSchema.methods.isStartTimeInFuture = function() {
  return isFuture(new Date(this.startTime));
};

var Event = mongoose.model("Event", EventSchema);

module.exports = Event;
