const crypto = require("crypto");
const Razorpay = require("razorpay");
const Course = require("../models/course");
const PaymentDetails = require("../models/PaymentDetails");
const dotenv = require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
exports.createPayment = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount || !currency) {
      return res
        .status(400)
        .json({ error: "Amount and currency are required" });
    }

    const options = {
      amount: amount, // Convert to paisa (INR 1 = 100 paisa)
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res
      .status(500)
      .json({ error: "Error creating order", details: error.message });
  }
};

// Verify Razorpay payment signature
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      userId,
      courseId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      try {
        let course = await Course.findById(courseId);

        if (!course) {
          return res
            .status(404)
            .json({ success: false, message: "Course not found" });
        }

        // Update course income and sales
        course.income += amount;
        course.sold += 1;
        await course.save();

        // Save payment details
        const payment = new PaymentDetails({
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          signature: razorpay_signature,
          amount,
          userId,
          courseId,
        });

        await payment.save();

        res.json({ success: true, message: "Payment Verified Successfully" });
      } catch (err) {
        console.error("Error updating course/payment:", err);
        res.status(500).json({
          success: false,
          message: "Error updating course/payment",
          details: err,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      details: error,
    });
  }
};
exports.getPaginatedPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default: page 1, 10 records per page

    const payments = await PaymentDetails.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit) // Skip previous pages
      .limit(limit) // Limit results per page
      .populate("courseId") // Populate course details
      .populate("userId") // Populate course details
      .lean(); // Convert Mongoose documents to plain objects

    const totalPayments = await PaymentDetails.countDocuments();

    res.json({
      success: true,
      data: payments,
      pagination: {
        totalPayments,
        totalPages: Math.ceil(totalPayments / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching paginated payments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payments",
      details: error,
    });
  }
};
