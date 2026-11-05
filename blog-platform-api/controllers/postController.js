const mongoose = require("mongoose");
const Post = require("../models/Post");

/**
 * @desc    Get all posts (Newest first, with author populated)
 * @route   GET /api/posts
 * @access  Public
 */
const getPosts = async (req, res) => {
  try {
    // Populate author with only name and email; sort newest first (-1 on createdAt)
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error("GetPosts Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while fetching posts"
    });
  }
};

/**
 * @desc    Get single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    const post = await Post.findById(id).populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    return res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error("GetPostById Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while fetching post"
    });
  }
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private (authMiddleware required)
 */
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate input fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide both title and content"
      });
    }

    // Assign author strictly from the authenticated user in req.user._id
    // This prevents mass assignment / author spoofing
    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: req.user._id
    });

    // Populate author details for the created response
    await post.populate("author", "name email");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post
    });
  } catch (error) {
    // Handle Mongoose validation errors (minlength, maxlength, etc.)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", ")
      });
    }

    console.error("CreatePost Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while creating post"
    });
  }
};

/**
 * @desc    Update an existing post
 * @route   PUT /api/posts/:id
 * @access  Private (authMiddleware required, owner only)
 */
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    // 2. Find post by ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // 3. Ownership check: Only post owner can update
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to update this post"
      });
    }

    // 4. Update allowed fields only (title & content) - author cannot be modified
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least title or content to update"
      });
    }

    if (title !== undefined) post.title = title.trim();
    if (content !== undefined) post.content = content.trim();

    // 5. Save changes and trigger schema validation
    await post.save();
    await post.populate("author", "name email");

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", ")
      });
    }

    console.error("UpdatePost Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while updating post"
    });
  }
};

/**
 * @desc    Delete an existing post
 * @route   DELETE /api/posts/:id
 * @access  Private (authMiddleware required, owner only)
 */
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    // 2. Find post by ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // 3. Ownership check: Only post owner can delete
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to delete this post"
      });
    }

    // 4. Remove post
    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.error("DeletePost Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while deleting post"
    });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
