const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Authentication Middleware
 * Protects routes by verifying the incoming Bearer JWT token
 * and attaching the authenticated user document to the request object.
 */
const authMiddleware = async (req, res, next) => {
  let token;

  // 1. Check if Authorization header exists and follows "Bearer <token>" pattern
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Return HTTP 401 if no token was provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided"
    });
  }

  try {
    // 3. Verify the token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Fetch the user associated with this token (excluding password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found"
      });
    }

    // 5. Attach the user object to the request for subsequent handlers
    req.user = user;
    next();
  } catch (error) {
    let message = "Not authorized, token invalid or expired";

    if (error.name === "TokenExpiredError") {
      message = "Session expired, please log in again";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token, authorization denied";
    }

    return res.status(401).json({
      success: false,
      message: message
    });
  }
};

module.exports = authMiddleware;
