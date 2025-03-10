const mongoose = require("mongoose");

// Schema for Courses
const CourseReviewSchema = new mongoose.Schema({
  courseRating: { type: Number, required: true },
  experienceRating: { type: Number, required: true },
  coachReview: { type: Number, required: true },
  description: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  timestamp: { type: Number, default: Date.now },
  courseid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
});

// Export as 'Course' model
module.exports = mongoose.model("CourseReview", CourseReviewSchema);
