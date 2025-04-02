const mongoose = require("mongoose");

// Schema for Workshops
const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // Workshop title must be unique
  shortDec: { type: String, required: true, index: true }, // Optimized for search
  longDec: { type: String, required: true, index: true }, // Optimized for search
  image: { type: String, required: true }, // Store image URL
  WorkshopCategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "WorkshopCategory",
  },
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "WorkshopReview", // Reference to WorkshopReview instead of CourseReview
    },
  ],
});

// Export as 'Workshop' model
module.exports = mongoose.model("Workshop", workshopSchema);
