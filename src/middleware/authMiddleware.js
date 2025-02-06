const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  // Get the token from the request header
  const token = req.header("Authorization");

  // Check if token is provided
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded; // Attach user data to request object
    next(); // Pass control to next middleware
  } catch (error) {
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = authMiddleware;
