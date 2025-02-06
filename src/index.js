const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const testRoutes = require("./routes/testRoutes");

app.use("/home", testRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is live @ http://localhost/${process.env.PORT}`);
});
