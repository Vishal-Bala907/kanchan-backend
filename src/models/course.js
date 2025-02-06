const mongoose = require("mongoose");

const soldCourses = new mongoose.Schema({
  date: { type: Date, default: Date.now }, // Store dates properly
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference User model
});

const userSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  shortDec: { type: String, required: true, index: true }, // Index for optimized searches
  longDec: { type: String, required: true, index: true }, // Index for optimized searches
  image: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  sold: [soldCourses], // Embedded sub-document
});

module.exports = mongoose.model("User", userSchema);
