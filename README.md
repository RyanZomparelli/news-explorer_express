# 📰 News Explorer — Backend API

The **News Explorer Backend API** is a RESTful server built with **Node.js**, **Express**, and **MongoDB**.  
It provides authentication, user management, and article persistence for the News Explorer frontend application.

This API was designed with **security, validation, and maintainability** as first-class concerns and follows modern backend best practices such as centralized error handling, schema validation, structured logging, and protected routes.

---

## 🚀 Features

- 🔐 JWT-based authentication (login & authorization)
- 👤 User registration and profile retrieval
- 📰 Save, retrieve, and delete news articles
- 🛡 Protected routes with authorization middleware
- ✅ Request validation with Celebrate / Joi
- 🧾 Structured request & error logging with Winston
- 🔒 Security headers via Helmet
- 🌱 Environment-based configuration using dotenv
- 🧱 Centralized error handling with custom error classes

---

## 🧰 Tech Stack

- Node.js
- Express
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Celebrate / Joi — request validation
- Helmet — HTTP security headers
- Winston — logging
- bcryptjs — password hashing
- dotenv — environment variables
- ESLint + Prettier — code quality

---

## 🔐 Authentication Flow

The API follows a **two-step authentication and authorization model**:

### 1️⃣ Registration

**POST** `/signup`

- Validates request body with Celebrate / Joi
- Hashes password using `bcrypt`
- Stores user securely in MongoDB
- Returns public user data (password never sent)

### 2️⃣ Login

**POST** `/signin`

- Verifies credentials via a static Mongoose method
- Generates a JWT valid for 7 days
- Returns token to the client

### 3️⃣ Authorization (Protected Routes)

- Client sends token via the `Authorization` header
- Authorization middleware:
  - Verifies the token
  - Attaches `req.user` to the request
- Controllers access user identity from `req.user`

---

## 🛣 API Endpoints

### Public Routes

- `POST /signup` — Register a new user
- `POST /signin` — Authenticate and receive a JWT

---

## ✅ Request Validation

All incoming requests are validated using **Celebrate / Joi** before reaching controllers.

If validation fails:

- The request is rejected early
- Controllers are never executed
- Errors are forwarded to the centralized error handler

This ensures:

- Cleaner controllers
- Consistent error responses
- Safer database operations

---

## 🛑 Error Handling

The API uses a **centralized error handling strategy**:

- Custom error classes (`BadRequest`, `Unauthorized`, `NotFound`, etc.)
- Celebrate validation errors handled explicitly
- All errors return consistent JSON responses
- No stack traces are leaked to clients in production

---

## 📜 Logging

Logging is implemented using **Winston**:

- Request logs for all incoming requests
- Error logs for failures and exceptions
- Log order ensures:
  - Requests are logged before controllers
  - Errors are logged before responses are sent

This setup is easily extendable to file or cloud logging providers.

---

## 🔒 Security

- Helmet sets secure HTTP headers
- Passwords are never stored or returned in plaintext
- JWT secrets and configuration are stored in environment variables
- Protected routes enforce authorization middleware

---

## 🔮 Future Improvements

- Integration & unit tests

---

## 👤 Author

**Ryan Zomparelli**  
Full-Stack Software Engineer  
Baltimore, MD

- GitHub: https://github.com/RyanZomparelli
- LinkedIn: https://www.linkedin.com/in/ryan-zomparelli/

---

## 🔗 Related Repositories

- **Frontend:** News Explorer React Application https://github.com/RyanZomparelli/news-explorer_react
