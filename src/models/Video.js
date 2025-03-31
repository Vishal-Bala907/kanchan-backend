const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true }, // Index for optimized searches
  url: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
});

module.exports = mongoose.model("Video", videoSchema);
