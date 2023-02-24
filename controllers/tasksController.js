const Task = require("../model/Task");


// get task by id
const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    
    if (!task) {
      res.status(404).json({ "message": "Task not found." });
    }

    // if its not the user's task
    if (task.user.toString() !== req.user) {
      res.status(401).json({ "message": "Not authorized." });
    }

    res.status(200).json({ "message": "Task found.", task });
  }
  catch (err) {
    console.log(err.message);
    res.status(500).send({ "message": "Internal server error." });
  }
};



const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.status(200).json({ "message": "Tasks found.", tasks})
  }
  catch (err) {
    console.log(err.message);
    res.status(500).send({ "message": "Internal server error." });
  }
};



const createTask = async (req, res) => {
  const { taskname, description } = req.body;
  
  try {
    const task = await Task.create({
      "taskname": taskname,
      "description": description,
      "completed": false,
      "user": req.user
    });
    res.status(201).json({ "message": "Task created successfully.", task });
  }
  catch (err) {
    console.log(err.message);
    res.status(500).send({ "message": "Internal server error." });
  }
};



const updateTask = async (req, res) => {
  const { id } = req.params;
  const { taskname, description, completed } = req.body;
  
  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ "message": "Task not found." });
    }

    if (task.user.toString() !== req.user) {
      return res.status(401).json({ "message": "Not authorized." });
    }

    task.taskname = taskname;
    task.description = description;
    task.completed = completed;

    const result = await task.save();
    res.status(200).json({ "message": "Task updated successfully." });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send({ "message": "Internal server error." });
  }
};



const deleteTask = async (req, res) => {
  const { id } = req.params;
  
  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ "message": "Task not found" });
    }

    if (task.user.toString() !== req.user) {
      return res.status(401).json({ "message": "Not authorized." });
    }

    const result = await task.remove();
    res.status(200).json({ "message": "Task deleted successfully." });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send({ "message": "Internal server error." });
  }
};



module.exports = { getTask, getAllTasks, createTask, updateTask, deleteTask };