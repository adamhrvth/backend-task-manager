const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const PORT = process.env.PORT;

const connectDB = require("./config/connectDB");

const tasksRoute = require("./routes/tasks");
const usersRoute = require("./routes/users");

const cors = require("cors");



const app = express();

app.use(cors({
  origin: "https://adamhrvth-task-manager.netlify.app",
  credentials: true
}));

// connect to database
connectDB();

// middleware for json, url encoded data handling and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/tasks", tasksRoute);
app.use("/api/users", usersRoute);

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));