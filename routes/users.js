const express = require("express");
const router = express.Router();

const { handleRegister, handleLogin, handleLogout,
        getMe, updateUser, changePassword,
        deleteUser } = require("../controllers/usersController");

const authorize = require("../middleware/authorize");
const { registerRules, loginRules, updateDetailsRules, updatePasswordRules } = require("../middleware/validator");
const { validateResult } = require("../middleware/validationResults");



router.post("/register", registerRules, validateResult, handleRegister);
router.post("/login", loginRules, validateResult, handleLogin);
router.get("/logout", authorize, handleLogout);
router.get("/me", authorize, getMe);
router.put("/changesettings", authorize, updateDetailsRules, validateResult, updateUser);
router.put("/changepassword", authorize, updatePasswordRules, validateResult, changePassword);
router.delete("/delete", authorize, deleteUser);

module.exports = router;