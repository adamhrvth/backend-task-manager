const User = require("../model/User");
const Task = require("../model/Task");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");



const handleRegister = async (req, res) => {
  // get user data from input
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    // if user already exists in DB
    if (user) {
      return res.status(409).json({ "message": "User with that e-mail address already exists!" });  // conflict
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      "username": username,
      "email": email,
      "password": hashedPassword
    });

    const result = await user.save();

    // create token
    const tokenPayload = {
      "user": user._id
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { "expiresIn": "1h" }
    );

    // add cookie
    res.cookie("token", token, { "httpOnly": true, "sameSite": "none", "secure": true, "expiresIn": "1h" });

    // send back user data without the password
    const { "password": extractHashedPassword, ...rest } = user._doc;

    res.status(201).json({ "message": "User Created Successfully", "user": rest });
  }
  catch (err) {
    console.log(err.message);
    res.status(500).json({ "message": "Internal server error." })
  }
};



const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  // Check if e-mail and pw provided
  if (!email || !password) return res.status(400).json({ "message": "E-mail and password are required!" });

  try {
    let user = await User.findOne({ email });

    // If user is not registered yet
    if (!user) {
      return res.status(401).json({ "message": "User not found." });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ "message": "Invalid password." });
    }

    // create token
    const tokenPayload = {
    "user": user._id
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { "expiresIn": "1h" }
    );

    // add cookie
    res.cookie("token", token, { "httpOnly": true, "sameSite": "none",  "secure": true,  "expiresIn": "1h" });

    // send back user data without the password
    const { "password": extractHashedPassword, ...rest } = user._doc;

    res.status(200).json({ "message": "Logged in successfully.", "user": rest });
  }
  catch (err) {
    console.log(err.message);
    res.status(500).json({ "message": "Internal server error." });
  }
};



const handleLogout = async (req, res) => {
  res.clearCookie("token", { "httpOnly": true, "sameSite": "none", "secure": true });
  res.status(200).json({ "message": "Logged out successfully."});
};



const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    // if not found
    if (!user) {
      return res.status(404).json({ "message": "User not found." });
    }

    const { password, ...rest } = user._doc;
    return res.status(200).json({ "message": "User found.", "user": rest });
  }
  catch (err) {
    console.log(err.message);
    res.status(500).json({ "message": "Internal server error." });
  }
};



const updateUser = async (req, res) => {
  const { username, email } = req.body;
  
  try {
    let user = await User.findById(req.user);

    // if user not found
    if (!user) {
      return res.status(404).json({ "message": "User not found." });
    }

    let emailExists = await User.findOne({ email });

    // if given e-mail address already exists
    if (emailExists && emailExists._id.toString() !== user._id.toString()) {
      return res.status(404).json({ "message": "A user with this e-mail already exists." });
    }

    user.username = username;
    user.email = email;
    
    await user.save();

    const { "password": extractHashedPassword, ...rest } = user._doc;

    return res.status(200).json({ "message": "User updated successfully.", "user": rest });
  }
  catch (err) {
    console.log(err.message)
    res.status(500).json({ "message": "Internal server error." });
  }
};



const changePassword = async (req, res) => {
  const { password, newPassword } = req.body;
  try {
    let user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ "message": "User not found." });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ "message": "Invalid password." });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    const { "password": extractHashedPassword, ...rest } = user._doc;

    return res.status(200).json({ "message": "Password updated successfully.", "user": rest });
  }
  catch (err) {
    console.log(err.message)
    res.status(500).json({ "message": "Internal server error." });
  }
};



const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ "message": "User not found." });
    }

    const task = await Task.find({ user: req.user });

    if (task) {
      await Task.deleteMany({ user: req.user });
    }

    res.clearCookie("token", { "httpOnly": true, "sameSite": "none", "secure": true });
    await user.remove();

    res.status(201).json({ "message": "User removed successfully." });
  }
  catch (err) {
    console.log(err.message);
    res.status(500).json({ "message": "Internal server error." });
  }
};



module.exports = { handleRegister, handleLogin, handleLogout, getMe, updateUser, changePassword, deleteUser };