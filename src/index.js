const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
// const testRoutes = require("./routes/testRoutes");

// route imports
const authRoutes = require("./routes/auth");
const adminCourseRoute = require("./routes/courses");
const blogRoute = require("./routes/blogRoute");
const paymentRoute = require("./routes/payment");
const courseReview = require("./routes/courseReview");
const queryRoute = require("./routes/queryRoutes");
const bookingRoute = require("./routes/bookingRoute");
const videoRoute = require("./routes/videoRoutes");
const Razorpay = require("razorpay");

// handle CORS here
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

// add cors to the app
app.use(cors(corsOption));
// use body parser
/*
body-parser is a middleware for Express.js used to parse incoming request bodies before reaching the route handlers. It helps extract data from POST and PUT requests, making it available in req.body.
*/
app.use(express.json());

// Initialize Razorpay instance

// route registration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminCourseRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/pay", paymentRoute);
app.use("/api/v1/review/course", courseReview);
app.use("/api/v1/query", queryRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/video", videoRoute);
// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
// app.use("/home", testRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is live @ http://localhost:${process.env.PORT}`);
});
