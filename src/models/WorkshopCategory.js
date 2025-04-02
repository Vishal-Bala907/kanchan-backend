const mongoose = require("mongoose");

const workshopCategorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true, unique: true, index: true },

    workShops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workshop",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkshopCategory", workshopCategorySchema);
