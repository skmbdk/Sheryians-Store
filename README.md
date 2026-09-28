# Authentication & Product CRUD APIs

A full-stack e-commerce web application featuring JWT Access & Refresh Token Authentication, Product CRUD APIs with `express-validator`, and a React frontend.

---

## 🚀 Project Overview

This project implements a secure backend API built with **Node.js**, **Express**, **MongoDB**, and **Mongoose**, alongside a **React** frontend built with Vite. It demonstrates end-to-end authentication, route protection, request validation, database persistence, and client-side integration.

---

## 🛠️ Technologies Used

### Backend
- **Node.js** & **Express.js** — Server & routing framework
- **MongoDB** & **Mongoose** — Database and object data modeling
- **jsonwebtoken (JWT)** — Access & Refresh token generation and verification
- **bcryptjs** — Password hashing (10 salt rounds)
- **express-validator** — Input validation & error handling
- **cookie-parser** — Parsing HTTP-only cookies for refresh tokens
- **cors** — Cross-Origin Resource Sharing configuration
- **dotenv** — Environment variable management

### Frontend
- **React (Vite)** — User interface library
- **Axios** — HTTP client with interceptors for automatic token refresh
- **Vanilla CSS** — Custom responsive design & layout

---

## 📂 Project Structure

```
assignment/
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js    # Register, login, refresh, logout, me
│   │   └── productController.js # Product CRUD logic
│   ├── middleware/
│   │   ├── auth.js          # Bearer JWT verification middleware
│   │   └── validate.js      # express-validator result checker
│   ├── models/
│   │   ├── User.js          # User Mongoose schema
│   │   └── Product.js       # Product Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.js    # Auth API routes
│   │   └── productRoutes.js # Product API routes
│   ├── validators/
│   │   ├── authValidator.js    # Register/Login input rules
│   │   └── productValidator.js # Product input & ID validation
│   ├── .env                 # Local environment config
│   ├── package.json
│   └── server.js            # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorMessage.jsx # Error alert display component
│   │   │   ├── Navbar.jsx       # Header & navigation component
│   │   │   └── ProductFormModal.jsx # Create/Edit product form
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx    # Login page
│   │   │   ├── RegisterPage.jsx # Register page
│   │   │   └── ProductPage.jsx  # Products listing & management page
│   │   ├── services/
│   │   │   └── api.js          # Axios configuration & interceptors
│   │   ├── App.jsx             # Main application state & routing
│   │   ├── index.css           # Custom styles
│   │   └── main.jsx            # React root mount
│   └── package.json
├── .env.example
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally on port `27017` (or a MongoDB Atlas URI)

### 1. Environment Configuration
Create a `.env` file inside the `backend/` directory (or copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sheryians_assignment
ACCESS_TOKEN_SECRET=super_secret_access_key_12345
REFRESH_TOKEN_SECRET=super_secret_refresh_key_67890
```

### 2. Backend Installation & Running
```bash
cd backend
npm install
npm run dev # Runs server on http://localhost:5000
```

### 3. Frontend Installation & Running
```bash
cd frontend
npm install
npm run dev # Runs Vite dev server on http://localhost:5173
```

---

## 🔐 Authentication Flow Explained

1. **Registration (`POST /api/auth/register`)**:
   - Validates `name`, `email`, `password`, `confirmPassword`.
   - Checks if email is already in use (returns `409 Conflict`).
   - Hashes password with `bcrypt` (10 rounds) before saving to MongoDB.
   - Returns user profile (without password). Does **not** return tokens.

2. **Login (`POST /api/auth/login`)**:
   - Compares credentials using `bcrypt.compare()`. Returns generic `401 Invalid email or password` on mismatch.
   - Generates short-lived **Access Token** (15 mins) sent in response JSON body.
   - Generates long-lived **Refresh Token** (7 days) saved in MongoDB on the user record.
   - Sets the Refresh Token in an **`httpOnly` cookie** (`refreshToken`) to prevent XSS attacks.

3. **Access Token Verification (`authenticate` middleware)**:
   - Reads `Authorization: Bearer <access_token>` from headers.
   - Verifies JWT against `ACCESS_TOKEN_SECRET`.
   - Attaches user object (excluding `password` and `refreshToken`) to `req.user`.

4. **Token Refresh (`POST /api/auth/refresh-token`)**:
   - Reads `refreshToken` from the `httpOnly` cookie.
   - Verifies token signature and checks if it matches the stored token in MongoDB.
   - Issues a new Access Token if valid.

5. **Logout (`POST /api/auth/logout`)**:
   - Invalidates the refresh token in MongoDB (`user.refreshToken = null`).
   - Clears the `refreshToken` cookie.

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Login & receive access token + cookie |
| `POST` | `/api/auth/refresh-token` | Public* | Issue new access token using cookie |
| `POST` | `/api/auth/logout` | Authenticated | Revoke refresh token & clear cookie |
| `GET` | `/api/auth/me` | Authenticated | Get profile of logged-in user |

### Product Routes (`/api/products`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List all products |
| `GET` | `/api/products/:id` | Public | Get single product by Mongo ID |
| `POST` | `/api/products` | Authenticated | Create a new product |
| `PUT` | `/api/products/:id` | Authenticated | Update existing product |
| `DELETE` | `/api/products/:id` | Authenticated | Delete existing product |

---

## 📝 Example API Request & Response Formats

### Register User
**Request:** `POST /api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "6aba62e4cfde424e44887cf9",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-09-28T12:51:48.213Z"
  }
}
```

### Validation Error Format
**Request:** `POST /api/products` with invalid data
```json
{
  "name": "",
  "price": -10,
  "stock": "invalid"
}
```
**Response (400 Bad Request):**
```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Product name is required" },
    { "field": "description", "message": "Product description is required" },
    { "field": "price", "message": "Price must be a number greater than or equal to 0" },
    { "field": "stock", "message": "Stock must be an integer greater than or equal to 0" }
  ]
}
```

---

## 💡 Code Review & Key Implementation Decisions

- **Why store refresh tokens in MongoDB?**
  Stolen or leaked JWT tokens cannot normally be revoked until they expire. By saving the refresh token (or its hash) in MongoDB, we can instantly invalidate it when a user logs out or if suspicious activity is detected.

- **Why return field-level 400 validation errors?**
  Using `express-validator` middleware before controller logic ensures invalid requests never touch the database. Returning structured `{ field, message }` arrays allows the React frontend to display specific field errors clearly.

- **Why automatic token refresh in Frontend Axios Interceptors?**
  Access tokens are short-lived (15 min) for security. When an access token expires during a session, the Axios response interceptor catches the `401` error, calls `/api/auth/refresh-token` behind the scenes using the HTTP-only cookie, saves the new access token, and retries the original request seamlessly without logging out the user.
