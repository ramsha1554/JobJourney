const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Robust Authorization header parsing
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "Authorization header is missing",
    });
  }

  const trimmed = String(authHeader).trim();
  const parts = trimmed.split(/\s+/);

  // Expect: Bearer <token>
  if (parts.length !== 2) {
    return res.status(401).json({
      success: false,
      error: "Authorization header is malformed. Expected: Bearer <token>",
    });
  }

  const scheme = parts[0];
  token = parts[1];

  if (!/^bearer$/i.test(scheme)) {
    return res.status(401).json({
      success: false,
      error: "Authorization scheme must be Bearer",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Be resilient to token payload shape
    const userId = decoded?.id || decoded?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Invalid token payload: missing user id",
      });
    }

    req.user = await User.findById(userId);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Token user no longer exists",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }
};

module.exports = { protect };
