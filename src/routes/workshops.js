const express = require("express");
const multer = require("multer");
const path = require("path");
// const Workshop = require("../models/Workshop");
const fs = require("fs");
const User = require("../models/User");
const workshop = require("../models/workshop");
const {
  addWorkshopCategory,
  getAllWorkshopCategories,
  deleteWorkshopCategory,
  addWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getAllWorkshops,
  getWorkshopByCategoryId,
  getWorkshopById,
  updateWorkshopImage,
} = require("../controller/workshopController");

const router = express.Router();

// Multer storage configuration (saves files with original extension)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

router.post("/add/category", addWorkshopCategory);
router.get("/get/category", getAllWorkshopCategories);
router.delete("/delete/category/:id", deleteWorkshopCategory);

router.post("/add/workshop", upload.single("image"), addWorkshop);
router.get("/get/workshops", getAllWorkshops);
router.get("/get-by-category/:id", getWorkshopByCategoryId);
router.get("/get/:id", getWorkshopById);

router.put("/update/:id", updateWorkshop);
router.delete("/delete/:id", deleteWorkshop);
router.put("/update-image/:id", upload.single("image"), updateWorkshopImage);

// POST Route: Upload Workshop
// router.post("/add/workshop", upload.single("image"), async (req, res) => {
//   try {
//     const { title, shortDec, longDec, price, offerPrice } = req.body;

//     if (!title || !shortDec || !longDec || !price || !offerPrice || !req.file) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const newWorkshop = new workshop({
//       title,
//       shortDec,
//       longDec,
//       price,
//       offerPrice,
//       image: `/uploads/${req.file.filename}`, // Store accessible image path
//     });

//     await newWorkshop.save();
//     res.status(201).json({ success: true, workshop: newWorkshop });
//   } catch (error) {
//     console.error("Error uploading workshop:", error);
//     res.status(500).json({ error: "Failed to upload workshop" });
//   }
// });

// // GET Route: Get All Workshops
// router.get("/all/workshops", async (req, res) => {
//   try {
//     const workshops = await Workshop.find().populate("ratings");
//     res.status(201).json({ success: true, workshop: workshops });
//   } catch (error) {
//     console.error("Error fetching workshops:", error);
//     res.status(500).json({ error: "Failed to get workshops" });
//   }
// });

// // GET Route: Get Workshop by ID
// router.get("/workshop/:id", async (req, res) => {
//   const { id } = req.params;
//   console.log(id);

//   try {
//     const workshop = await Workshop.findById(id).populate({
//       path: "ratings",
//       populate: {
//         path: "user", // This will populate the 'user' field inside each rating
//         model: "User",
//       },
//     });

//     if (!workshop) {
//       return res.status(404).json({ error: "Workshop not found" });
//     }

//     res.status(200).json({ success: true, workshop });
//   } catch (error) {
//     console.error("Error fetching workshop:", error);
//     res.status(500).json({ error: "Failed to get workshop" });
//   }
// });

// // Update Workshop API
// router.put("/update/:workshopId", upload.single("image"), async (req, res) => {
//   try {
//     const { workshopId } = req.params;
//     const { title, shortDec, longDec, price, offerPrice } = req.body;
//     let updatedFields = { title, shortDec, longDec, price, offerPrice };

//     // If a new image is uploaded, update the image field
//     if (req.file) {
//       updatedFields.image = `/uploads/${req.file.filename}`;
//     }

//     // Find and update workshop
//     const updatedWorkshop = await Workshop.findByIdAndUpdate(
//       workshopId,
//       updatedFields,
//       { new: true }
//     );

//     if (!updatedWorkshop) {
//       return res.status(404).json({ error: "Workshop not found" });
//     }

//     res.status(200).json({
//       message: "Workshop updated successfully",
//       workshop: updatedWorkshop,
//     });
//   } catch (error) {
//     console.error("Error updating workshop:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Delete Workshop API
// router.delete("/delete/:workshopId", async (req, res) => {
//   try {
//     const { workshopId } = req.params;

//     // Find the workshop by ID
//     const workshop = await Workshop.findById(workshopId);
//     if (!workshop) {
//       return res.status(404).json({ error: "Workshop not found" });
//     }

//     // Remove image file if it exists
//     if (workshop.image) {
//       const imagePath = path.join(__dirname, "..", workshop.image); // Convert to absolute path
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath); // Delete the file
//       }
//     }

//     // Delete the related reviews from the workshop schema
//     await WorkshopReview.deleteMany({ workshopId: workshopId });

//     // Delete the workshop from the database
//     await Workshop.findByIdAndDelete(workshopId);

//     res.status(200).json({ message: "Workshop deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting workshop:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

module.exports = router;
