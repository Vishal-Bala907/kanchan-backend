// Create an order
const express = require("express");
const {
  createPayment,
  verifyPayment,
} = require("../controller/paymentController");
// const course = require("../models/course");

const router = express.Router();

router.post("/create-order", createPayment);

router.post("/verify-payment", verifyPayment);

module.exports = router;
