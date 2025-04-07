const express = require("express");
const Video = require("../models/Video");
const cloudinary = require("../lib/cloudinary");

const router = express.Router();
// Create a new video
router.post("/add", async (req, res) => {
  try {
    const video = new Video(req.body);
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all videos
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a video by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Delete from Cloudinary
    await cloudinary.api.delete_resources([video.cloudinaryPublicId], {
      resource_type: "video",
    });

    // Delete from MongoDB
    await Video.findByIdAndDelete(id);

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
