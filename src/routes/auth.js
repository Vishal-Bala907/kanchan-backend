const express = require("express");
const { body } = require("express-validator");
const {
  signUpController,
  loginController,
} = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");
const route = express.Router();

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

route.get("/test", authMiddleware, (req, res) => {
  res.send("Hello from protected route");
});
module.exports = route;
