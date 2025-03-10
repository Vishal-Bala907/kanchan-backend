const express = require("express");
const {
  handleGetAllReviews,
  handleDeleteCourseReview,
  handlePostcourseReview,
  handleGetCourseReview,
} = require("../controller/courseReviewController");
// const path = require("path");

// const course = require("../models/course");

const router = express.Router();

router.get("/get/all-reviews", handleGetAllReviews);

router.get("/get/course-reviews/:courseId", handleGetCourseReview);

router.post("/post/course-reviews/:courseId", handlePostcourseReview);
router.delete("/delete/course-review/:courseId", handleDeleteCourseReview);

module.exports = router;
