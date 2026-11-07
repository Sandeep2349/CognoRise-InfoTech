const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Post = require("../models/Post");
const generateToken = require("../utils/generateToken");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, and password"
      });
    }

    // 2. Normalize and check if email is already registered
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered"
      });
    }

    // 3. Password length check prior to hashing
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters"
      });
    }

    // 4. Hash the password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create and save the new user in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    // 6. Return response without password or hash
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    // Handle Mongoose validation errors (e.g., regex email mismatch)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", ")
      });
    }

    console.error("Register Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred during user registration"
    });
  }
};

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find user by email and explicitly select password (because select: false is on schema)
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    // 3. Check if user exists (use generic invalid message for security)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 4. Compare entered password with stored bcrypt hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 5. Generate signed JWT token
    const token = generateToken(user._id);

    // 6. Return token and safe user details (never password)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred during login"
    });
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by authMiddleware)
 */
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Authenticated profile retrieved successfully",
      user: req.user
    });
  } catch (error) {
    console.error("GetMe Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving profile"
    });
  }
};

/**
 * @desc    Delete current user account & cascade-delete their posts
 * @route   DELETE /api/auth/me
 * @access  Private (Protected by authMiddleware)
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Cascade delete all posts authored by this user
    const deletedPostsResult = await Post.deleteMany({ author: userId });

    // 2. Permanently delete the user document
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User account and all associated posts deleted successfully",
      deletedPostsCount: deletedPostsResult.deletedCount
    });
  } catch (error) {
    console.error("Delete Account Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while deleting account"
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  deleteAccount
};
