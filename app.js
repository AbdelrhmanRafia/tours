const express = require("express");
const errorHandling = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");
const reviewsRouter = require("./routes/reviewRoute");
const viewRouter = require("./routes/viewRouter");
const bookingRoute = require("./routes/bookingRoute");
const cors = require("cors");
const AppError = require("./utils/appError");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(
  cors({
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());


app.set("query parser", "extended");

app.use(express.static(path.join(__dirname, "public")));

// app.use(cookieParser());

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// // Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price'
//     ]
//   })
// );

// app.use(compression());

// 3_  Routes

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/booking", bookingRoute);

app.use((req, res, next) => {
  next(new AppError(`Can't Find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandling);

module.exports = app;
