const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  deleteAccount
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes to manage account & profile
router.get("/me", authMiddleware, getMe);
router.delete("/me", authMiddleware, deleteAccount);

module.exports = router;
