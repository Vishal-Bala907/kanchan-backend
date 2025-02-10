// Create an order
const express = require("express");
const {
  createPayment,
  verifyPayment,
  getPaginatedPayments,
} = require("../controller/paymentController");
// const course = require("../models/course");

const router = express.Router();

router.post("/create-order", createPayment);

router.post("/verify-payment", verifyPayment);

// API Endpoint: Fetch paginated payments (newest first)
router.get("/payments", getPaginatedPayments);
module.exports = router;
