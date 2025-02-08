const {
  createBlog,
  getLatestBlog,
  randomThreeBlogs,
} = require("../controller/blogController");

const express = require("express");
const multer = require("multer");

const router = express.Router();

// Multer Storage (Uploads Folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

router.post(
  "/add",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "img1", maxCount: 1 },
    { name: "img2", maxCount: 1 },
  ]),
  createBlog
);
router.get("/get/:id", getLatestBlog);
router.get("/random/three", randomThreeBlogs);

module.exports = router;
