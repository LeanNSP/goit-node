const mongoose = require("mongoose");

const ErrorHandler = require("./errorHandlers/ErrorHandler");

require("dotenv").config();

const { MONGODB_URL } = process.env;

module.exports = function connectionOnDB() {
  try {
    const connectDB = mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (connectDB) {
      console.log("\x1b[33m%s\x1b[0m", "Database connection successful");
    }
  } catch (error) {
    throw new ErrorHandler(500, "No database connection!");
  }
};
