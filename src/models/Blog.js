const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    bannerImage: { type: String, required: true },
    img1: { type: String },
    img2: { type: String },
    blogHeading: { type: String, required: true },
    blogDescription: { type: String, required: true },
    blogContent: { type: String, required: true }, // MongoDB handles large text automatically
    date: { type: Date, required: true, default: Date.now }, // Fix: Corrected 'require' & added default value
  },
  { timestamps: true }
); // Auto-adds createdAt & updatedAt fields

module.exports = mongoose.model("Blog", blogSchema);

// module.exports = Blog;
