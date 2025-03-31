const Workshop = require("../models/workshop");
const WorkshopReview = require("../models/WorkshopReview");

// Get all workshop reviews
exports.handleGetAllWorkshopReviews = async (req, res) => {
  try {
    const reviews = await WorkshopReview.find();
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get reviews for a specific workshop
exports.handleGetWorkshopReview = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const reviews = await WorkshopReview.find({ workshopId });
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Post a review for a workshop
exports.handlePostWorkshopReview = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const newReview = new WorkshopReview(req.body);
    const savedReview = await newReview.save();

    if (!savedReview) {
      return res.status(500).json({ error: "Failed to save review" });
    }

    // Add review ID to workshop schema
    const reviewId = savedReview._id;
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ error: "Workshop not found" });
    }

    workshop.ratings.push(reviewId);
    const updatedWorkshop = await workshop.save();
    if (!updatedWorkshop) {
      return res.status(500).json({ error: "Failed to update workshop" });
    }

    res.status(201).json(savedReview);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a workshop review
exports.handleDeleteWorkshopReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await WorkshopReview.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Remove the review from the workshop schema
    const workshop = await Workshop.findById(deletedReview.workshopId);
    if (workshop) {
      workshop.ratings.pull(deletedReview._id);
      await workshop.save();
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Server error" });
  }
};
