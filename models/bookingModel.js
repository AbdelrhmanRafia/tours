const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Types.ObjectId,
    ref: "Tour",
    required: [true, "Booking must belong to a tour"],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a user"],
  },
  price: {
    type: Number,
    required: [true, "booking must have a price."],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function () {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
});

const booking = mongoose.model("Booking", bookingSchema);

module.exports = booking;
