const mongoose = require("mongoose");

const userPurchasedCourses = new mongoose.Schema({
  date: { type: Date, default: Date.now }, // Store dates properly
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  }, // Reference Course model
  price: { type: Number, required: true }, // Store price as a number
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true }, // Index for optimized searches
  phone: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  courses: [userPurchasedCourses], // Embedded sub-document
});

module.exports = mongoose.model("User", userSchema);
