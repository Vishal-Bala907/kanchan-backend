const mongoose = require("mongoose");

// const userPurchasedCourses = new mongoose.Schema({
//   date: { type: Date, default: Date.now }, // Store dates properly
//   courseId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Course",
//     required: true,
//   }, // Reference Course model
//   price: { type: Number, required: true }, // Store price as a number
// });

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  }, // Index for optimized searches
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
    index: true,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "PaymentDetails",
    index: true,
  },
  price: { type: number, required: true },
  date: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Purchase", purchaseSchema);
