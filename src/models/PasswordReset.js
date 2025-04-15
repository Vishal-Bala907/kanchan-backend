const mongoose = require("mongoose");

const pwdResetSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  }, // Index for optimized searches
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  issuedAt: { type: Number, required: true },
  expiredAt: { type: Number, required: true },
});

// TTL index: automatically delete document after expiredAt
pwdResetSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PasswordReset", pwdResetSchema);
