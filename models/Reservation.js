var mongoose = require("mongoose")

var ReservSchema = mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "Host"},
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing"},
  payAndWait: Boolean,
  totalPrice: Number
  // receipts: [ { type: mongoose.Schema.Types.ObjectId, ref: "Receipt"}]
}, { timestamps: true })
