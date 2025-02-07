const { validationResult } = require("express-validator");
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../helpers/hashPassowrd");
const jwt = require("jsonwebtoken");

exports.testHomeController = (req, res) => {
  return res.status(200).json({ message: "this is just a test" });
};

exports.signUpController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: [errors.array()] });
  }

  const { email, phone, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      if (user.phone === phone) {
        return res.status(400).json({ message: "Phone number Already exists" });
      } else {
        return res.status(400).json({ message: "Email Already exists" });
      }
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      phone,
      password: hashedPassword,
      role: "USER",
    });
    const userNew = await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: userNew });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "unable to create a new user" });
  }
};
exports.loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: [errors.array()] });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || (await comparePassword(user.password, password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    res.status(200).json({ token: token, user: user });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "unable to log in" });
  }
};
