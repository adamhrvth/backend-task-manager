const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskname: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {timestamps: true});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;