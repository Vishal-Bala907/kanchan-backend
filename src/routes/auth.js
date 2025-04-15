const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  signUpController,
  loginController,
} = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const route = express.Router();
const nodemailer = require("nodemailer");
const PasswordReset = require("../models/PasswordReset");
const { hashPassword } = require("../helpers/hashPassowrd");
// const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASSWORD, // Not your actual Gmail password!
  },
});

route.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Valid email is requred"),
    body("phone")
      .isLength(10)
      .withMessage("Please enter a valid 10 digits mobile number"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("name")
      .isLength({ min: 6 })
      .withMessage("name must be at least 6 characters long"),
  ],
  signUpController
);

route.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is requred"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  loginController
);

route.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  console.log(email);

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const otp = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  // sending OTP
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.SMTP_AUTH_USE}>`, // Don't forget the angle brackets for valid email format
      to: email,
      subject: "OTP for password reset",
      text: `Your OTP is ${otp}`,
      html: `<b>Your OTP is ${otp}</b>`,
    });
    // gemerated otp
    const issuedAt = new Date();
    const expiredAt = new Date(issuedAt.getTime() + 15 * 60 * 1000); // 10 minutes
    await PasswordReset.create({
      userId: user._id,
      email,
      otp,
      issuedAt,
      expiredAt,
    });

    // mail sent successfully
    // console.log("Email sent:", info.messageId);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
  }
});

route.post("/verify-otp", async (req, res) => {
  const { email, OTP } = req.body;
  // console.log(email);

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // fetch the OTP
    const currentTime = new Date().getTime();
    const passwordReset = await PasswordReset.findOne({
      email: email,
      expiredAt: { $gt: currentTime },
    });
    console.log(passwordReset);

    if (!passwordReset) {
      return res.status(400).json({ message: "OTP not found" });
    }
    if (passwordReset.otp !== OTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // await PasswordReset.deleteOne({ _id: passwordReset._id });
    res.status(200).json({
      message: "OTP verified successfully",
      user: user,
      otpId: passwordReset._id,
    });

    // return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

route.post(
  "/reset-password",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const { otpId, userId, password } = req.body;

    try {
      // Check validation result
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }

      const currentTime = new Date(); // Fix: use Date object for Date comparison

      const passwordReset = await PasswordReset.findOne({
        _id: otpId,
        userId: userId,
        expiredAt: { $gt: currentTime }, // Fix: comparing with Date, not timestamp
      });

      if (!passwordReset) {
        return res.status(400).json({ message: "OTP is invalid or expired" });
      }

      const user = await User.findById(passwordReset.userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const hashedPassword = await hashPassword(password);
      // console.log(password);

      // console.log(hashedPassword);

      user.password = hashedPassword;
      // console.log(password);

      await user.save();

      // Delete used OTP
      await PasswordReset.deleteOne({ _id: passwordReset._id });

      return res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
      console.error("Error in /reset-password:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

route.get("/test", authMiddleware, (req, res) => {
  res.send("Hello from protected route");
});
module.exports = route;
