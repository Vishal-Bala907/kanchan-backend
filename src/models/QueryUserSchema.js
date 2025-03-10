const mongoose = require("mongoose");
// import express from "express";

// const app = express();
// app.use(express.json());

const QuerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  timestampDateAndTime: { type: String, required: true },
  timestamp: { type: Number, required: true },
  message: { type: String, required: true },
  role: { type: String, required: true },
});

const QueryUserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  timestampDateAndTime: { type: String, required: true },
  timestamp: { type: Number, required: true },
  query: { type: [QuerySchema], required: true },
});

// const QueryUser = mongoose.model("QueryUser", QueryUserSchema);
module.exports = mongoose.model("QueryUserSchema", QueryUserSchema);
