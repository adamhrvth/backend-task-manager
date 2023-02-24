const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to database.");
  }
  catch (err) {
    console.log(err.message);
  }
}

module.exports = connectDB;