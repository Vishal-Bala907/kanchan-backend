const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");
const app = express();

// route imports
const authRoutes = require("./routes/auth");
const adminCourseRoute = require("./routes/courses");
const blogRoute = require("./routes/blogRoute");
const paymentRoute = require("./routes/payment");
const courseReview = require("./routes/courseReview");
const queryRoute = require("./routes/queryRoutes");
const bookingRoute = require("./routes/bookingRoute");
const workshopRoutes = require("./routes/workshops"); // ✅ Workshop Routes
const workshopReviewRoutes = require("./routes/workshopReview"); // ✅ Workshop Review Routes
const videoRoute = require("./routes/videoRoutes"); // ✅ Video Route

// handle CORS
const DEV_ORIGIN = process.env.DEV_ORIGIN;
const PROD_ORIGIN = process.env.PROD_ORIGIN;
const allowedOrigins = [DEV_ORIGIN, PROD_ORIGIN];

const corsOption = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error : Origin ${origin} is not allowed`));
    }
  },
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOption));
app.use(express.json());

// Route registration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminCourseRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/pay", paymentRoute);
app.use("/api/v1/review/course", courseReview);
app.use("/api/v1/query", queryRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/workshops", workshopRoutes); // ✅ Workshop Routes
app.use("/api/v1/review/workshop", workshopReviewRoutes); // ✅ Workshop Review Routes
app.use("/api/v1/video", videoRoute); // ✅ Video Route

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is live @ http://localhost:${process.env.PORT}`);
});
