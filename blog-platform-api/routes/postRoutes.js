const express = require("express");
const router = express.Router();

const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.get("/", getPosts);
router.get("/:id", getPostById);

// Protected routes (require valid JWT bearer token)
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
