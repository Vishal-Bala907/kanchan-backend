const mongoose = require("mongoose");

const PaymentDetailsSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    signature: { type: String, required: true },
    amount: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    timestamp: { type: Number, default: Date.now },
  },
  { timestamps: true }
);

const PaymentDetails = mongoose.model("PaymentDetails", PaymentDetailsSchema);

module.exports = PaymentDetails;
