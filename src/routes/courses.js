const express = require("express");
const multer = require("multer");
const path = require("path");
const Course = require("../models/course");
const fs = require("fs");
// const path = require("path");

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

// Update Course API
router.put("/update/:courseId", upload.single("image"), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, shortDec, longDec, price, offerPrice } = req.body;
    let updatedFields = { title, shortDec, longDec, price, offerPrice };

    // If a new image is uploaded, update the image field
    if (req.file) {
      updatedFields.image = `/uploads/${req.file.filename}`;
    }

    // Find and update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updatedFields,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res
      .status(200)
      .json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete Course API
router.delete("/delete/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Remove image file if it exists
    if (course.image) {
      const imagePath = path.join(__dirname, "..", course.image); // Convert to absolute path
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the file
      }
    }

    // Delete the course from the database
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
