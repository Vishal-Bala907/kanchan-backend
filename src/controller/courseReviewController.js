const Course = require("../models/course");
const CourseReview = require("../models/CourseReview");

exports.handleGetAllReviews = async (req, res) => {
  try {
    const reviews = await CourseReview.find();
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.handleGetCourseReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await CourseReview.find({ courseId });
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.handlePostcourseReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const newReview = new CourseReview(req.body);
    const savedReview = await newReview.save();
    if (!savedReview) {
      return res.status(500).json({ error: "Failed to save review" });
    }
    // handle the course schema
    const reviewid = savedReview._id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    course.ratings.push(reviewid);
    const updatedCourse = await course.save();
    if (!updatedCourse) {
      return res.status(500).json({ error: "Failed to update course" });
    }

    res.status(201).json(savedReview);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.handleDeleteCourseReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await CourseReview.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    // remove the review from the course schema
    const course = await Course.findById(deletedReview.courseid);
    course.ratings.pull(deletedReview._id);
    await course.save();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Server error" });
  }
};
