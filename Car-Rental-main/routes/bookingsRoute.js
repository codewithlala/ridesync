const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51R3D0hDkXFDdQgJnFr0LwDuD8qMCR9gOQozzCAA39TmKeIlFSdcsmvx6G6a08Ttv7xcx6aNxUqeoQFf4kaax9nkj00E3UvRr7o"
);

router.post("/bookcar", async (req, res) => {
  const { token } = req.body;
  try {
    // Create a payment method using the token from Stripe Elements
    const paymentMethod = await stripe.paymentMethods.retrieve(token.id);

    // Create a new customer if one doesn't exist
    const customer = await stripe.customers.create({
      email: token.email || "customer@example.com",
      payment_method: paymentMethod.id,
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(req.body.totalAmount * 100), // convert to cents
      currency: "inr",
      customer: customer.id,
      payment_method: paymentMethod.id,
      confirm: true, // confirm the payment immediately
      description: `Car Rental - ${req.body.totalHours} hours`,
      receipt_email: token.email || customer.email,
      metadata: {
        carId: req.body.car,
        userId: req.body.user,
        hours: req.body.totalHours,
      },
    });

    if (paymentIntent.status === "succeeded") {
      // Save transaction ID from payment intent
      req.body.transactionId = paymentIntent.id;

      // Create booking record
      const newbooking = new Booking(req.body);
      await newbooking.save();

      // Update car booking slots
      const car = await Car.findOne({ _id: req.body.car });
      car.bookedTimeSlots.push(req.body.bookedTimeSlots);
      await car.save();

      // Return success response with booking and payment details
      res.status(200).json({
        success: true,
        message: "Your booking is successful",
        booking: newbooking,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100, // convert back to original currency
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment was not successful",
        status: paymentIntent.status,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "There was an error processing your payment",
      error: error.message,
    });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("car");
    res.send(bookings);
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
