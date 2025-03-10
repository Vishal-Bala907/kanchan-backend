const express = require("express");
const {
  postNewQuery,
  getAllQuery,
  getQueryByUserId,
} = require("../controller/queryController");

// const course = require("../models/course");

const router = express.Router();
// POST request to create a new query user
router.post("/query-user", postNewQuery);

// GET request to fetch all query users
router.get("/query-users", getAllQuery);

// GET request to fetch a query user by ID
router.get("/query-user/:id", getQueryByUserId);
module.exports = router;
