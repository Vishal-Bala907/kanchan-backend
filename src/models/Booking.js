const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    eventDate: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    specialRequests: { type: String, trim: true },
  },
  { timestamps: true }
);

// export default mongoose.model("Booking", bookingSchema);
module.exports = mongoose.model("Booking", bookingSchema);
