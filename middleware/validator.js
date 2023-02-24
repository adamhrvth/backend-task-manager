const { check } = require("express-validator");

const registerRules = [
  check("username", "Name is required.").notEmpty().trim().escape(),
  check("email", "Please give a valid e-mail.").isEmail().normalizeEmail(),
  check("password", "Password has to be at least 6 characters.").isLength({ "min": 6 })
];

const loginRules = [
  check("email", "Please give a valid e-mail.").isEmail().normalizeEmail(),
];

const updateDetailsRules = [
  check("username", "Name is required.").notEmpty().trim().escape(),
  check("email", "Please give a valid e-mail.").isEmail().normalizeEmail()
];

const updatePasswordRules = [
  check("newPassword", "Password has to be at least 6 characters.").isLength({ "min": 6 }),
];

const createTaskRules = [
  check("taskname", "Name of the task is required.").notEmpty().trim().escape(),
  check("description", "Description is required.").notEmpty().trim().escape()
];

const updateTaskRules = [
  check("taskname", "Name of the task is required.").notEmpty().trim().escape(),
  check("description", "Description is required.").notEmpty().trim().escape(),
  check("completed", "Completion field is required.").notEmpty().trim().escape().isBoolean()
];

module.exports = { registerRules, loginRules, updateDetailsRules, updatePasswordRules, createTaskRules, updateTaskRules };