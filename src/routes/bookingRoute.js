const mongoose = require("mongoose");
const express = require("express");
const Booking = require("../models/Booking.js");

const router = express.Router();

// POST: Create a new booking
router.post("/book-event", async (req, res) => {
  const { name, email, phone, eventDate, guests, specialRequests } = req.body;
  console.log(req.body);

  if (!name || !email || !phone || !eventDate || !guests) {
    return res
      .status(400)
      .json({ error: "All fields except special requests are required" });
  }

  try {
    const newBooking = new Booking({
      name,
      email,
      phone,
      eventDate,
      guests,
      specialRequests,
    });
    await newBooking.save();
    res
      .status(201)
      .json({ success: true, message: "Booking confirmed!", data: newBooking });
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// GET: Fetch all event bookings in descending order
router.get("/all-bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ eventDate: -1 }); // Sort in descending order

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No bookings found" });
    }

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching event bookings:", error);
    res.status(500).json({ success: false, error: "Failed to fetch bookings" });
  }
});
module.exports = router;
