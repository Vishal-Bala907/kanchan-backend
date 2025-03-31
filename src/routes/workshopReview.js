const express = require("express");
const {
  handleGetAllWorkshopReviews,
  handleDeleteWorkshopReview,
  handlePostWorkshopReview,
  handleGetWorkshopReview,
} = require("../controller/workshopReviewController");

const router = express.Router();

router.get("/get/all-reviews", handleGetAllWorkshopReviews);

router.get("/get/workshop-reviews/:workshopId", handleGetWorkshopReview);

router.post("/post/workshop-reviews/:workshopId", handlePostWorkshopReview);

router.delete("/delete/workshop-review/:workshopId", handleDeleteWorkshopReview);

module.exports = router;
