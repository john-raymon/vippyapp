var mongoose = require("mongoose");

var ReservSchema = mongoose.Schema(
  {
    id: { type: String, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "Host" },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
    payAndWait: Boolean,
    totalPrice: Number,
    stripeChargeId: String,
    stripeTransferId: String,
    paidToHost: { type: Boolean, default: false },
    redeemed: { type: Boolean, default: false },
    paid: { type: Boolean, default: false },
    cancelled: {
      type: Boolean,
      default: false
    }
    // receipts/transactions: [ { type: mongoose.Schema.Types.ObjectId, ref: "Receipt"}]
  },
  { id: false, timestamps: true }
);

// return amount for the host after collecting a 20% application fee
ReservSchema.methods.amountForHost = function() {
  return parseInt(this.totalPrice * 0.8);
};

ReservSchema.methods.toProfileJSON = function() {
  const {
    customer,
    host,
    listing,
    payAndWait,
    totalPrice,
    stripeChargeId,
    redeemed,
    cancelled
  } = this;

  return {
    id: this._id,
    confirmationCode: this.id,
    customer: customer.toProfileJSON(),
    host: host.toProfileJSON(),
    listing,
    payAndWait,
    totalPrice,
    stripeChargeId,
    redeemed,
    cancelled
  };
};

var Reservation = mongoose.model("Reservation", ReservSchema);

module.exports = Reservation;
