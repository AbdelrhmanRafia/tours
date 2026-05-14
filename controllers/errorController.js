const AppError = require("../utils/appError");

const handleNotValidObjectID = (err) => {
  const message = `invalid ${err.path}  with value : ${err.value} please enter valid id`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value : ${Object.keys(err.keyValue)[0]} please use other value`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = `Invalid input data : ${Object.values(err.errors)
    .map((err) => `${err.path} :  ${err.message} `)
    .join(", ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token, please log in again!", 401);
const handleJWTExpiresError = () =>
  new AppError("your token expires, please log in again!", 401);

const sentErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
  // 2) Send generic message
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

const sendErrorDev = (err, req, res) => {
  // console.log("err.statusCode", err.statusCode);
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) RENDERED WEBSITE
  console.error("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const errorHandling = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // console.log("=====>", err);
  // console.log("=====>vvvv", req.path);
  // console.log("=====>vvvv", req.originalUrl);
  console.log(Object.keys(err));
  // console.log(Object.keys(Object.values(err.errors)[0]));

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err?.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (err?.kind === "ObjectId") {
      error = handleNotValidObjectID(error);
    }
    if (Object.keys(err)?.includes("errors")) {
      error = handleValidationErrorDB(error);
    }
    if (err.name === "JsonWebTokenError") {
      error = handleJWTError(err);
    }
    if (err.name === "TokenExpiredError") {
      error = handleJWTExpiresError(err);
    }

    sentErrorProd(error, req, res);
  }
};

module.exports = errorHandling;
