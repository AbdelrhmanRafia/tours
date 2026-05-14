/* eslint-disable no-undef */
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION ========>", err);
  console.log(`=> ${err.name}`, `=> ${err.message}`);

  process.exit(1);
});
const mongoose = require("mongoose");

require("dotenv").config();
const app = require("./app");

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("mongodb running");
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION ========>");
  console.log(`=> ${err.name}`, `=> ${err.message}`);
  server.on("close", () => {
    process.exit(1);
  });
});
