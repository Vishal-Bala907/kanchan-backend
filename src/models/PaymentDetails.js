const mongoose = require("mongoose");

const PaymentDetailsSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    signature: { type: String, required: true },
    amount: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, required: true },
    timestamp: { type: Number, default: Date.now },
    reqId: { type: Number, required: true },
  },
  { timestamps: true }
);

const PaymentDetails = mongoose.model("PaymentDetails", PaymentDetailsSchema);

module.exports = PaymentDetails;
