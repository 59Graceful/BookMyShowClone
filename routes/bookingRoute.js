const validatingAuthToken = require("../middleware/authMiddleware");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const router = require("express").Router();
const stripe = require("stripe")(process.env.StripeSecretKey);

// router.post("/make-payment", validatingAuthToken, async (req, res) => {
//   try {
//     // const { token, amount } = req.body;

//     // const customer = await stripe.customers.create({
//     //   email: token.email,
//     //   source: token.id,
//     // });

//     // const charge = await stripe.paymentIntents.create({
//     //   amount: amount,
//     //   currency: "usd",
//     //   customer: customer.id,
//     //   receipt_email: token.email,
//     //   description: "Ticket Booked for Movie",
//     //   "automatic_payment_methods[enabled]": true,
//     // });

//     // const transactionId = charge.id;

//     res.send({
//       success: true,
//       message: "Payment successful",
//       data: transactionId,
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });

router.post("/make-payment", validatingAuthToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.send({
        success: false,
        message: "Missing required param: amount.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Movie Ticket",
            },
            unit_amount: amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      success_url:
        "http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/payment-failed",
    });

    res.send({
      success: true,
      url: session.url,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});


// router.post("/book-show", validatingAuthToken, async (req, res) => {
//   try {
//     // save booking
//     const newBooking = new Booking(req.body);
//     await newBooking.save();

//     const show = await Show.findById(req.body.show);
//     // update seats
//     await Show.findByIdAndUpdate(req.body.show, {
//       bookedSeats: [...show.bookedSeats, ...req.body.seats],
//     });

//     res.send({
//       success: true,
//       message: "Show booked successfully",
//       data: newBooking,
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });

router.post("/book-show", validatingAuthToken, async (req, res) => {
  try {
    const newBooking = new Booking({
      show: req.body.show,
      seats: req.body.seats,
      transactionId: req.body.transactionId,
      user: req.userId, // ✅ ALWAYS from token
    });

    await newBooking.save();

    const show = await Show.findById(req.body.show);
    await Show.findByIdAndUpdate(req.body.show, {
      bookedSeats: [...show.bookedSeats, ...req.body.seats],
    });

    res.send({
      success: true,
      message: "Show booked successfully",
      data: newBooking,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// router.get("/get-bookings", validatingAuthToken, async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.userId })
//       .populate("show")
//       .populate({
//         path: "show",
//         populate: {
//           path: "movie",
//           model: "movies",
//         },
//       })
//       .populate("user")
//       .populate({
//         path: "show",
//         populate: {
//           path: "theatre",
//           model: "theatres",
//         },
//       });

//     res.send({
//       success: true,
//       message: "Bookings fetched successfully",
//       data: bookings,
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });
router.get("/get-bookings", validatingAuthToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate({
        path: "show",
        populate: [
          { path: "movie", model: "movies" },
          { path: "theatre", model: "theatres" },
        ],
      });

    res.send({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = router;