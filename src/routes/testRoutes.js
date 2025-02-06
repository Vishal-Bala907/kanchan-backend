const express = require("express");
const { testHomeController } = require("../controller/testController");
const route = express.Router();
route.get("/", testHomeController);

module.exports = route;
