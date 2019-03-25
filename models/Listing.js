var mongoose = require("mongoose")

var ListingSchema = mongoose.Schema({
  name: String,
  guestCount: Number,
  host: { type: mongoose.Schema.Types.ObjectId, ref: "Host" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  currentReservations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation"}],
  payAndWait: Boolean,
  images: [String],
  bookingPrice: Number,
  disclaimers: String,
  bookingDeadline: Date
})
