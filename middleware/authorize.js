const jwt = require("jsonwebtoken");

const authorize = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ "message": "Not authorized." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  }
  catch (err) {
    if (err.message === "jwt expired") {
      res.status(500).json({ "message": "Your session has expired. Please refresh this page and log in again." });
    }
    else {
      res.status(500).json({ "message": "Internal server error." })
    }
  }
};

module.exports = authorize;