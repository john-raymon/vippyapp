var mongoose = require("mongoose")

var ReservSchema = mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "Host"},
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing"},
  payAndWait: Boolean,
  totalPrice: Number,
  stripeChargeId: String
  // receipts/transactions: [ { type: mongoose.Schema.Types.ObjectId, ref: "Receipt"}]
}, { timestamps: true })


// return amount for the host after collecting a 20% application fee
ReservSchema.methods.amountForHost = function() {
  return parseInt(this.totalPrice * 0.8);
}

var Reservation = mongoose.model('Reservation', ReservSchema)

module.exports = Reservation
