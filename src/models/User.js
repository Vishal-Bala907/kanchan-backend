const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true }, // Index for optimized searches
  phone: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
