var mongoose = require("mongoose")

var EventSchema = mongoose.Schema({
  name: { type: String, required: [ true, 'is required' ] },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "Host" },
  currentListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing"}],
  date: { type: Date, required: [ true, 'is required'] },
  startTime: { type: Date, required: [ true, 'is required' ] },
  endTime: { type: Date, required: [ true, 'is required' ] },
  address: {
    street: { type: String, required: [ true, 'is required' ] },
    city: { type: String, required: [ true, 'is required' ] },
    state: { type: String, required: [ true, 'is required' ] },
    zip: { type: String, required: [ true, 'is required' ] }
  }
})

var Event = mongoose.model('Event', EventSchema)

module.exports = Event
