# 🚀 02backend — Node.js / Express / MongoDB REST API

A production-ready backend API built with **Node.js, Express.js, and MongoDB**, following clean architecture and industry best practices.  
This project implements **JWT-based authentication (access & refresh tokens)**, **secure cookies**, **Cloudinary file uploads**, and **modular routing** for users, videos, and channels.

The backend is designed for a **video-based platform** (YouTube-style architecture) and is scalable, secure, and interview-ready.

---

## ✨ Features

### 🔐 Authentication & Security
- User registration and login
- JWT access & refresh token implementation
- Secure `httpOnly` cookies
- Password hashing using `bcryptjs`
- Token refresh endpoint
- Protected routes using authentication middleware

### 👤 User Management
- Fetch user profile
- Update email and password
- Upload & update:
  - Profile picture
  - Avatar
  - Cover image
- Logout and token invalidation

### 🎥 Video Management
- Update video metadata:
  - Title
  - Description
  - Tags
  - Likes
  - Views
  - Dislikes
- Authentication required for all video routes

### 📺 Channel Management
- Update channel name and description
- Fetch channel subscribers
- Ownership-based authorization

### ☁️ File Uploads
- File uploads using **Multer**
- Temporary storage in `public/temp`
- Upload to **Cloudinary**
- Automatic cleanup after successful upload

### 🧩 Architecture
- Centralized error handling
- Standard API response format
- Async error wrapper for controllers
- Clean separation of concerns

---

## 🛠 Tech Stack

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**Authentication & Security**
- jsonwebtoken (JWT)
- bcryptjs
- cookie-parser
- CORS

**File Uploads**
- Multer
- Cloudinary

---

## 📁 Project Structure

```bash
src/
│
├── app.js                  # Express app & middlewares
├── index.js                # Server entry point
│
├── database/
│   └── user.database.js    # MongoDB connection
│
├── middlewares/
│   ├── auth.middlewares.js
│   ├── channel.middleware.js
│   ├── video.middlewares.js
│   └── middlewares.js      # Multer configuration
│
├── models/
│   ├── user.model.js
│   ├── video.model.js
│   ├── channel.model.js
│   └── subscription.model.js
│
├── controllers/
│   ├── user.controller.js
│   ├── video.controller.js
│   └── channel.controller.js
│
├── routes/
│   ├── user.routes.js
│   ├── video.routes.js
│   └── channel.routes.js
│
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   └── cloudinary.js
│
public/
└── temp/                   # Temporary upload folder
`

## Getting Started
### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudinary account (for image storage)

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file in the project root:
```
PORT=8000
CORS_ORIGIN=http://localhost:3000
COOKIE_SECRET=your-cookie-secret

# MongoDB
MONOGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net
DB_NAME=your-db-name

# JWT
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET_KEY=your-refresh-token-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Run
```bash
npm start
```
Starts the server with nodemon at `src/index.js`. Default port is `8000`.

## API Overview
Base path: `/api/v1`

- Users (`/user`)
  - POST `/register` — multipart/form-data (profilePicture, coverImage?, avatar?)
  - POST `/login`
  - POST `/logout` — requires auth
  - PATCH `/password` — requires auth
  - PATCH `/profile-picture` — requires auth, single file `profilePicture`
  - PATCH `/cover-picture` — requires auth, single file `coverImage`
  - PATCH `/avatar` — requires auth, single file `avatar`
  - PATCH `/email` — requires auth
  - GET `/profile` — requires auth
  - POST `/refresh` — refresh access token using refresh token

- Videos (`/video`) — requires auth for all
  - PATCH `/title`
  - PATCH `/description`
  - PATCH `/tags`
  - PATCH `/likes`
  - PATCH `/views`
  - PATCH `/dislikes`

- Channels (`/channel`) — requires auth and ownership
  - PATCH `/name`
  - PATCH `/description`
  - GET `/subscribers`

## Conventions
- Use `ApiResponse` for successful responses and `ApiError` for errors.
- Wrap async route handlers with `asyncHandler`.
- Set secure, httpOnly cookies for tokens.
- Keep uploads in `public/temp` and forward to Cloudinary.

## Scripts
```json
{
  "start": "nodemon src/index.js"
}
```

## Notes
- Ensure CORS and cookie settings match your frontend origin.
- The MongoDB env variable key is `MONOGODB_URL` (as used in the code).
