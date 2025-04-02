const workshop = require("../models/workshop");
const WorkshopCategory = require("../models/WorkshopCategory");
const WorkshopReview = require("../models/WorkshopReview");
const path = require("path");
const fs = require("fs");

exports.addWorkshopCategory = async (req, res) => {
  try {
    const { category } = req.body;

    const existed = await WorkshopCategory.findOne({ category });
    if (existed) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new WorkshopCategory({ categoryName: category });
    await newCategory.save();
    return res.status(201).json(newCategory);
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

exports.getAllWorkshopCategories = async (req, res) => {
  try {
    const categories = await WorkshopCategory.find();
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.deleteWorkshopCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (!(await WorkshopCategory.findById(id))) {
      return res.status(404).json({ error: "Category not found" });
    }

    const exists = await WorkshopCategory.findById(id);
    if (!exists) {
      return res.status(404).json({ error: "Category not found" });
    }

    await WorkshopCategory.findByIdAndDelete(id);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

exports.addWorkshop = async (req, res) => {
  try {
    const { title, categoryId, shortDec, longDec } = req.body;

    const category = await WorkshopCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // new workshop instance
    const newWorkshop = new workshop({
      title,
      WorkshopCategory: categoryId,
      shortDec,
      longDec,
      image: `/uploads/${req.file.filename}`,
    });
    await newWorkshop.save();
    category.workShops.push(newWorkshop);
    category.save();
    return res.status(201).json(newWorkshop);
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

exports.getAllWorkshops = async (req, res) => {
  try {
    const workshops = await workshop.find().populate("WorkshopCategory");
    return res.status(200).json(workshops);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getWorkshopByCategoryId = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await WorkshopCategory.findById(id).populate("workShops");
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const workshops = category.workShops;
    return res.status(200).json(workshops);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getWorkshopById = async (req, res) => {
  try {
    const id = req.params.id;
    const wks = await workshop.findById(id);
    if (!wks) {
      return res.status(404).json({ message: "No Workshop found..." });
    }
    return res.status(200).json(wks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, categoryId, shortDec, longDec } = req.body;

    console.log(categoryId);

    const category = await WorkshopCategory.findById(categoryId); // Find the category by ID
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    } else {
      const wks = await workshop.findById(id);
      if (!wks) {
        return res.status(404).json({ error: "Workshop not found" });
      }
      // change the category
      if (wks.WorkshopCategory.toString() !== categoryId) {
        const prevCate = await WorkshopCategory.findById(wks.WorkshopCategory);
        const currentCate = await WorkshopCategory.findById(categoryId);
        wks.WorkshopCategory = categoryId;
        if (prevCate) {
          // update the prev category
          prevCate.workShops.pull(wks._id);
          await prevCate.save();
        }
        currentCate.workShops.push(wks._id);
        await currentCate.save();
      }

      wks.title = title;
      wks.shortDec = shortDec;
      wks.longDec = longDec;
      await wks.save();
      return res.status(200).json(wks);
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.deleteWorkshop = async (req, res) => {
  try {
    const id = req.params.id;
    const exists = await workshop.findById(id);
    if (!exists) {
      return res.status(404).json({ error: "Workshop not found" });
    }

    const categories = await WorkshopCategory.findById(exists.WorkshopCategory);
    // delete workshop instance from catgeory
    if (categories) {
      categories.workShops.pull(exists._id);
      await categories.save();
    }
    // save the category
    // await categories.save();
    // delete workshop reviews
    await WorkshopReview.deleteMany({ workshopId: id });
    // delete workshop
    await workshop.findByIdAndDelete(id);
    // also remove the workshop image
    // Remove image file if it exists
    if (exists.image) {
      const imagePath = path.join(__dirname, "../..", exists.image);
      console.log(imagePath);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the file
      }
    }

    // also delete related workshop reviews
    return res.status(200).json({ message: "Workshop deleted successfully" });
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

exports.updateWorkshopImage = async (req, res) => {
  try {
    const id = req.params.id; // ✅ Corrected "params"

    // ✅ Await the query
    const exists = await workshop.findById(id);
    if (!exists) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    // ✅ Check if file exists in request
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // ✅ Remove previous image if exists
    if (exists.image) {
      const imagePath = path.join(__dirname, "../..", exists.image);
      console.log(imagePath);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the file
      }
    }

    // ✅ Save new image
    exists.image = `/uploads/${req.file.filename}`;
    await exists.save();

    return res.status(200).json({
      message: "Workshop image updated successfully",
      image: exists.image,
    });
  } catch (err) {
    console.error("Error updating workshop image:", err); // ✅ Better error logging
    return res.status(500).json({ message: err.message });
  }
};
