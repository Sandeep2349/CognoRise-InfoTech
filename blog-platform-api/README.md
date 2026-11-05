# Blog Platform REST API

> **CognoRise InfoTech Web Development Internship**  
> A robust, secure, and production-ready RESTful API for a modern multi-user blogging platform built with Node.js, Express.js, MongoDB Atlas, and JWT authentication.

---

## Table of Contents
- [Overview & Objectives](#overview--objectives)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Project Folder Structure](#project-folder-structure)
- [Installation & Setup](#installation--setup)
- [MongoDB Atlas Configuration](#mongodb-atlas-configuration)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Documentation & Endpoints](#api-documentation--endpoints)
  - [Authentication Routes](#1-authentication-endpoints-apiauth)
  - [Blog Post CRUD Routes](#2-blog-post-crud-endpoints-apiposts)
- [Security, Authorization & Error Handling](#security-authorization--error-handling)
- [Postman Testing & Collection Guide](#postman-testing--collection-guide)
- [Submission Checklist](#submission-checklist)

---

## Overview & Objectives

The **Blog Platform REST API** serves as the backend engine for a full-featured blogging service. It is designed to handle user lifecycle management, token-based authentication, and full CRUD (Create, Read, Update, Delete) operations on blog posts with strict ownership controls.

### Core Objectives
1. **Stateless Authentication**: Implement secure JWT (JSON Web Token) authentication with encrypted passwords via `bcryptjs`.
2. **Relational Data Modeling**: Associate blog posts with their respective authors using Mongoose `ObjectId` references.
3. **Strict Authorization**: Guarantee that users can only modify or delete blog posts they personally created.
4. **Data Sanitization & Integrity**: Prevent sensitive information leakage (such as password hashes) and safeguard against mass assignment vulnerabilities.
5. **Robust Error Handling**: Handle Mongoose validation errors, duplicate keys, and malformed ObjectIds with clean HTTP status codes.

---

## Key Features

- **User Registration & Validation**: Validates unique emails with regex patterns, enforces minimum password lengths, and hashes credentials using a salt factor of 10.
- **Secure Authentication**: Authenticates users against hashed passwords and issues time-limited JWTs. Excludes password hashes by default (`select: false`).
- **Post Management**:
  - Public listing of all posts with newest-first ordering (`sort({ createdAt: -1 })`).
  - Author details (`name` and `email`) dynamically populated via Mongoose `.populate()`.
  - Individual post retrieval by MongoDB `ObjectId`.
- **Ownership Controls**:
  - Protected creation: Associates posts with the authenticated user via `req.user._id`.
  - Protected updates: Prevents non-owners from updating titles or contents (`HTTP 403 Forbidden`).
  - Protected deletions: Prevents non-owners from deleting articles (`HTTP 403 Forbidden`).
- **Input Sanitization**: Author field cannot be forged via request bodies.

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| **Node.js (v18+)** | JavaScript server runtime environment |
| **Express.js (v5)** | Lightweight, fast web framework for REST API routing |
| **MongoDB Atlas** | Cloud-hosted NoSQL document database |
| **Mongoose (v9)** | Object Data Modeling (ODM) library for MongoDB |
| **jsonwebtoken (JWT)** | Stateless bearer token generation and verification |
| **bcryptjs** | One-way salted password hashing |
| **cors** | Cross-Origin Resource Sharing middleware |
| **dotenv** | Environment configuration management |
| **nodemon** | Development live-reload utility |

---

## Project Folder Structure

```text
blog-platform-api/
├── config/
│   └── db.js                             # MongoDB connection and ping logic
├── controllers/
│   ├── authController.js                 # Authentication logic (register, login, getMe)
│   └── postController.js                 # Blog CRUD logic (get, create, update, delete)
├── middleware/
│   └── authMiddleware.js                 # JWT Bearer token verification middleware
├── models/
│   ├── Post.js                           # Mongoose schema and model for blog posts
│   └── User.js                           # Mongoose schema and model for users
├── routes/
│   ├── authRoutes.js                     # Express routes for authentication
│   └── postRoutes.js                     # Express routes for blog posts
├── utils/
│   └── generateToken.js                  # JWT signing utility
├── .env.example                          # Sanitized environment variable template
├── .gitignore                            # Excludes node_modules and .env files
├── Blog_Platform_API.postman_collection.json # Ready-to-import Postman test suite
├── package.json                          # Dependencies and npm scripts
├── server.js                             # Express application entry point
└── README.md                             # Comprehensive documentation
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)
- [Postman](https://www.postman.com/) (for testing)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd "Cognorise InfoTech/blog-platform-api"
```

### Step 2: Install Dependencies
```bash
npm install
```

---

## MongoDB Atlas Configuration

1. Log into your **MongoDB Atlas** account.
2. Under **Deployment** > **Database**, create a free **M0 cluster**.
3. Under **Security** > **Database Access**:
   - Create a database user (e.g. `blog_user`).
   - Assign the **Read and write to any database** privilege.
   - Note the password securely.
4. Under **Security** > **Network Access**:
   - Add an IP address rule: allow `0.0.0.0/0` (Allow Access from Anywhere) for remote development or specify your current IP address.
5. In your cluster dashboard, click **Connect** > **Drivers** (Node.js) and copy the connection string:
   ```text
   mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
   ```

---

## Environment Variables

Copy the template file `.env.example` to create your local `.env` configuration file:

```bash
cp .env.example .env
```

Open `.env` in your text editor and fill in your connection details:

```env
# Server Configuration
PORT=5000

# MongoDB Atlas URI (replace placeholders with your real credentials)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database_name>?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=1d
```

> [!WARNING]
> Never commit your `.env` file to source control. It is already included in `.gitignore` to protect sensitive credentials.

---

## Running the Server

### Production / Standard Mode
```bash
npm start
```

### Development Mode (with Live Reload via Nodemon)
```bash
npm run dev
```

When successfully launched, you will see output similar to:
```text
MongoDB Connected: cluster0-shard-00-00.mongodb.net
MongoDB ping successful!
Server running on port 5000
```

---

## API Documentation & Endpoints

Base URL: `http://localhost:5000/api`

### 1. Authentication Endpoints (`/api/auth`)

#### `POST /api/auth/register`
* **Access**: Public
* **Description**: Registers a new user. Hashes password before storing.
* **Request Body**:
  ```json
  {
    "name": "Jane Developer",
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "_id": "6aec76a3f763c363a2dd34f4",
      "name": "Jane Developer",
      "email": "jane@example.com",
      "createdAt": "2026-11-05T12:29:23.207Z"
    }
  }
  ```

#### `POST /api/auth/login`
* **Access**: Public
* **Description**: Authenticates user credentials and returns a signed JWT.
* **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6aec76a3f763c363a2dd34f4",
      "name": "Jane Developer",
      "email": "jane@example.com",
      "createdAt": "2026-11-05T12:29:23.207Z"
    }
  }
  ```

#### `GET /api/auth/me`
* **Access**: Private (Requires `Authorization: Bearer <token>`)
* **Description**: Fetches the profile of the currently logged-in user.
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Authenticated profile retrieved successfully",
    "user": {
      "_id": "6aec76a3f763c363a2dd34f4",
      "name": "Jane Developer",
      "email": "jane@example.com",
      "createdAt": "2026-11-05T12:29:23.207Z",
      "updatedAt": "2026-11-05T12:29:23.207Z"
    }
  }
  ```

---

### 2. Blog Post CRUD Endpoints (`/api/posts`)

#### `GET /api/posts`
* **Access**: Public
* **Description**: Fetches all posts sorted by creation date in descending order (newest first). Populates author `name` and `email`.
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 1,
    "posts": [
      {
        "_id": "6aec7a82f763c363a2dd3510",
        "title": "Mastering Node.js and Express",
        "content": "A comprehensive guide to building modular RESTful APIs.",
        "author": {
          "_id": "6aec76a3f763c363a2dd34f4",
          "name": "Jane Developer",
          "email": "jane@example.com"
        },
        "createdAt": "2026-11-05T12:45:00.000Z",
        "updatedAt": "2026-11-05T12:45:00.000Z"
      }
    ]
  }
  ```

#### `GET /api/posts/:id`
* **Access**: Public
* **Description**: Retrieves a single post by MongoDB ObjectId.
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "post": {
      "_id": "6aec7a82f763c363a2dd3510",
      "title": "Mastering Node.js and Express",
      "content": "A comprehensive guide to building modular RESTful APIs.",
      "author": {
        "_id": "6aec76a3f763c363a2dd34f4",
        "name": "Jane Developer",
        "email": "jane@example.com"
      },
      "createdAt": "2026-11-05T12:45:00.000Z",
      "updatedAt": "2026-11-05T12:45:00.000Z"
    }
  }
  ```

#### `POST /api/posts`
* **Access**: Private (Requires `Authorization: Bearer <token>`)
* **Description**: Creates a new post. Author is automatically set from the JWT payload.
* **Request Body**:
  ```json
  {
    "title": "Scalable Backend Architectures",
    "content": "Separation of concerns is key: controllers handle requests, models define schemas, routes direct traffic."
  }
  ```
* **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Post created successfully",
    "post": {
      "_id": "6aec7a82f763c363a2dd3510",
      "title": "Scalable Backend Architectures",
      "content": "Separation of concerns is key: controllers handle requests, models define schemas, routes direct traffic.",
      "author": {
        "_id": "6aec76a3f763c363a2dd34f4",
        "name": "Jane Developer",
        "email": "jane@example.com"
      },
      "createdAt": "2026-11-05T12:50:00.000Z",
      "updatedAt": "2026-11-05T12:50:00.000Z"
    }
  }
  ```

#### `PUT /api/posts/:id`
* **Access**: Private (Requires token; owner only)
* **Description**: Updates title or content of a post. If the requesting user does not own the post, returns `403 Forbidden`.
* **Request Body**:
  ```json
  {
    "title": "Scalable Backend Architectures (Second Edition)",
    "content": "Updated content with additional notes on JWT rotation."
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Post updated successfully",
    "post": {
      "_id": "6aec7a82f763c363a2dd3510",
      "title": "Scalable Backend Architectures (Second Edition)",
      "content": "Updated content with additional notes on JWT rotation.",
      "author": {
        "_id": "6aec76a3f763c363a2dd34f4",
        "name": "Jane Developer",
        "email": "jane@example.com"
      },
      "updatedAt": "2026-11-05T12:55:00.000Z"
    }
  }
  ```

#### `DELETE /api/posts/:id`
* **Access**: Private (Requires token; owner only)
* **Description**: Permanently removes a post. Non-owners receive `403 Forbidden`.
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Post deleted successfully"
  }
  ```

---

## Security, Authorization & Error Handling

### 1. Password Hashing & Safe Selection
- Passwords are salt-hashed using `bcryptjs.genSalt(10)` before insertion.
- The `User` model defines `select: false` on the password attribute. Any query like `User.find()` or `User.findById()` automatically excludes the password hash from query results.
- Only the login controller calls `.select("+password")` strictly for credential comparison.

### 2. Authorization & Ownership Enforcing
- In `updatePost` and `deletePost`, the post author is checked against `req.user._id`:
  ```javascript
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: You are not authorized to modify this post"
    });
  }
  ```
- This guarantees zero tampering between different platform users.

### 3. Defensive Validation & Status Codes
- `400 Bad Request`: Returned when required fields are missing, strings fail regex validation, or ObjectId strings are malformed (`mongoose.Types.ObjectId.isValid`).
- `401 Unauthorized`: Returned when Bearer tokens are missing, expired, or invalid.
- `403 Forbidden`: Returned when an authenticated user attempts to modify or delete a resource owned by another user.
- `404 Not Found`: Returned when a queried post ID does not exist in MongoDB.
- `500 Internal Server Error`: Generic fallback error to protect server internal traces.

---

## Postman Testing & Collection Guide

A pre-configured Postman collection is provided in the repository:
[`Blog_Platform_API.postman_collection.json`](./Blog_Platform_API.postman_collection.json)

### Importing into Postman
1. Open **Postman**.
2. Click the **Import** button in the upper left.
3. Select or drag-and-drop `Blog_Platform_API.postman_collection.json`.
4. The collection **Blog Platform REST API - CognoRise InfoTech** will appear in your workspace with **22 test requests**.

### Automatic Token & Variable Management
The collection uses Postman collection variables:
- `{{base_url}}`: Defaults to `http://localhost:5000/api`.
- `{{token}}`: Automatically populated when you run the **Login User - Success** request.
- `{{post_id}}`: Automatically populated when you execute the **Create Post - Success** request.

### Running with Postman Collection Runner
1. Right-click the collection in Postman and select **Run Collection**.
2. Ensure all requests are checked.
3. Click **Run Blog Platform REST API**. All positive and negative assertions will execute and pass sequentially!

---

## Submission Checklist

- [x] Node.js, Express, MongoDB Atlas & Mongoose setup
- [x] User registration with email regex validation & duplicate rejection
- [x] Password hashing with bcryptjs (salt factor 10)
- [x] User login returning signed JWT
- [x] Auth middleware verifying Bearer tokens and attaching `req.user`
- [x] Public `GET /api/posts` (all posts, newest first, populated author)
- [x] Public `GET /api/posts/:id` with ObjectId format validation
- [x] Protected `POST /api/posts` (author strictly set from `req.user._id`)
- [x] Protected `PUT /api/posts/:id` with 403 authorization check for non-owners
- [x] Protected `DELETE /api/posts/:id` with 403 authorization check for non-owners
- [x] `.env.example` verified with placeholders only
- [x] `.gitignore` updated to exclude `.env`, `node_modules`, and logs
- [x] Full Postman collection exported (`Blog_Platform_API.postman_collection.json`)
- [x] Zero hardcoded credentials in codebase or documentation
