const mongoose = require("mongoose");

// Schema for Courses
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // Course title must be unique
  shortDec: { type: String, required: true, index: true }, // Optimized for search
  longDec: { type: String, required: true, index: true }, // Optimized for search
  image: { type: String, required: true }, // Store image URL
  price: { type: Number, required: true }, // Original price
  offerPrice: { type: Number, required: true }, // Discounted price
  sold: { type: Number, default: 0 },
  income: { type: Number, default: 0 },
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CourseReview",
    },
  ],
});

// Export as 'Course' model
module.exports = mongoose.model("Course", courseSchema);
