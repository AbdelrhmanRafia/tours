const catchAsync = require("../utils/catchAsync");
const Tour = require("./../models/tourModel");
const Booking = require("./../models/bookingModel");
const AppError = require("./../utils/appError");

exports.getOverview = catchAsync(async (req, res) => {
  //1) get tour data from collection
  const tours = await Tour.find();
  // 2) build tour template

  // 3) render template from step 1

  res.status(200).render("overview", {
    title: "All tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  // 1) get data from request
  const tour = await Tour.findOne({ slug }).populate("reviews");

  if (!tour) {
    return next(new AppError("there is no tour with that name", 404));
  }
  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render("login", {
    title: "log in to your account",
  });
};
exports.getSignupFrom = (req, res, next) => {
  res.status(200).render("signup", {
    title: "Sign up ",
  });
};

exports.getAccount = (req, res, next) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  const tourIDs = bookings.map((el) => el.tour);

  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});
