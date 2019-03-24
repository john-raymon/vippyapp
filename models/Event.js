var mongoose = require("mongoose")

var EventSchema = mongoose.Schema({
  name: String,
  host: { type: mongoose.Schema.Types.ObjectId, ref: "Host" },
  currentListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing"}],
  date: Date,
  startTime: Date,
  endTime: Date,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  }
})
