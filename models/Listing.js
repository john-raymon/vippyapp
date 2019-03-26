var mongoose = require("mongoose");

var ListingSchema = mongoose.Schema({
  name: String,
  guestCount: Number,
  host: { type: mongoose.Schema.Types.ObjectId, ref: "Host" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  currentReservations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }
  ],
  payAndWait: Boolean,
  images: [String],
  bookingPrice: Number,
  disclaimers: String,
  quantity: Number,
  unlimitedQuantity: Boolean,
  bookingDeadline: Date
});

ListingSchema.methods.toJSONForHost = function(currentHost = { _id: "" }) {
  if (!currentHost._id.equals(this.host._id)) {
    console.log("returned due to unauth host", currentHost._id, this.host._id);
    return this._toJSON();
  }
  // by host we're assuming host of listing, anyone else is a username
  const {
    _id: id,
    name,
    guestCount,
    host,
    event,
    currentReservations,
    payAndWait,
    images,
    bookingPrice,
    disclaimers,
    quantity,
    unlimitedQuantity,
    bookingDeadline
  } = this;

  return {
    id,
    name,
    guestCount,
    host: host.toProfileJSON(),
    event: event.toJSONForListing(currentHost),
    currentReservations,
    payAndWait,
    images,
    bookingPrice,
    disclaimers,
    quantity,
    unlimitedQuantity,
    bookingDeadline
  };
};

ListingSchema.methods._toJSON = function() {
  // by host we're assuming host of listing, anyone else is a username
  const {
    _id: id,
    name,
    guestCount,
    host,
    event,
    payAndWait,
    images,
    bookingPrice,
    disclaimers,
    quantity,
    unlimitedQuantity,
    bookingDeadline
  } = this;

  console.log("the event is", this.event);

  return {
    id,
    name,
    guestCount,
    host: host.toProfileJSON(),
    event: event.toJSONForListing(),
    payAndWait,
    images,
    bookingPrice,
    disclaimers,
    quantity,
    unlimitedQuantity,
    bookingDeadline
  };
};

var Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;
