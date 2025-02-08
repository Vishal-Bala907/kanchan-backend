const crypto = require("crypto");
const Razorpay = require("razorpay");
const dotenv = require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
exports.createPayment = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    // console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
    // console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);
    // Check if required parameters exist
    if (!amount || !currency) {
      return res
        .status(400)
        .json({ error: "Amount and currency are required" });
    }

    console.log("Creating order:", { amount, currency });

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: "Payment Verified Successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error verifying payment", details: error });
  }
};
