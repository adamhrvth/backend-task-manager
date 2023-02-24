const express = require("express");
const router = express.Router();

const { getTask, getAllTasks, createTask, updateTask, deleteTask } = require("../controllers/tasksController");

const authorize = require("../middleware/authorize");
const { createTaskRules, updateTaskRules } = require("../middleware/validator");
const { validateResult } = require("../middleware/validationResults");



router.get("/:id", authorize, getTask);
router.get("/", authorize, getAllTasks);
router.post("/create", authorize, createTaskRules, validateResult, createTask);
router.put("/update/:id", authorize, updateTaskRules, validateResult, updateTask);
router.delete("/delete/:id", authorize, deleteTask)

module.exports = router;