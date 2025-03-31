const mongoose = require("mongoose");

// Schema for Workshop Reviews
const WorkshopReviewSchema = new mongoose.Schema({
  workshopRating: { type: Number, required: true },
  experienceRating: { type: Number, required: true },
  coachReview: { type: Number, required: true },
  description: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  timestamp: { type: Number, default: Date.now },
  workshopId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Workshop",
  },
});

// Export as 'WorkshopReview' model
module.exports = mongoose.model("WorkshopReview", WorkshopReviewSchema);
