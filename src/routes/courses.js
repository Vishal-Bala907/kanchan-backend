const express = require("express");
const multer = require("multer");
const path = require("path");
const Course = require("../models/course");
// const course = require("../models/course");

const router = express.Router();

// Multer storage configuration (saves files with original extension)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// POST Route: Upload Course
router.post("/add/course", upload.single("image"), async (req, res) => {
  try {
    const { title, shortDec, longDec, price, offerPrice } = req.body;

    if (!title || !shortDec || !longDec || !price || !offerPrice || !req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCourse = new Course({
      title,
      shortDec,
      longDec,
      price,
      offerPrice,
      image: `/uploads/${req.file.filename}`, // Store accessible image path
    });

    await newCourse.save();
    res.status(201).json({ success: true, course: newCourse });
  } catch (error) {
    console.error("Error uploading course:", error);
    res.status(500).json({ error: "Failed to upload course" });
  }
});

// GET Route: Upload Course
router.get("/all/course", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(201).json({ success: true, course: courses });
  } catch (error) {
    console.error("Error uploading course:", error);
    res.status(500).json({ error: "Failed to get course" });
  }
});
// GET Route: Upload Course
router.get("/course/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const courses = await Course.findById(id);
    res.status(201).json({ success: true, course: courses });
  } catch (error) {
    console.error("Error uploading course:", error);
    res.status(500).json({ error: "Failed to get course" });
  }
});

module.exports = router;
