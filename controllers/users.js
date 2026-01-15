const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Creating a User object instance from the mongoose model.
const User = require("../models/user");

// Error classes
const BadRequestError = require("../utils/errors/bad-request-err");
const ConflictError = require("../utils/errors/conflict-err");
const UnauthorizedError = require("../utils/errors/unauthorized-err");
const NotFoundError = require("../utils/errors/not-found-err");

// Token key
const { JWT_SECRET } = require("../utils/config");

const register = async (req, res, next) => {
  const { email, password, username } = req.body;

  try {
    // Hash the hash 10 times!
    const hash = await bcrypt.hash(password, 10);

    // Only save the hash.
    const user = await User.create({
      email,
      password: hash,
      name: username,
    });

    // Don't send the password.
    res.status(201).send({ email: user.email, name: user.name });
  } catch (err) {
    // Error from mongoose schema validation.
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    // code is a property of an error object that MongoDb will return when a
    // duplicate email is used since we made it a unique property.
    if (err.code === 11000) {
      return next(new ConflictError("Email already in use"));
    }
    // Catch all for unexpected errors. Returns 500 server error.
    next(err);
  }
};

/* Auth flow:
     0. Register (createUser).
     1. Login (login -> getUserByCredentials -> jwt.sign). Authenticate
     2. getCurrentUser (CheckAuthorization). Authorize
     */

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      // In the try block? throw it to the catch block.
      throw new UnauthorizedError("Incorrect email or password");
    }

    // Architecture/Organization: Why not put the logic from this method in this controller?
    const user = await User.findUserByCredentials(email, password);

    // Create a token for authorization on protected routes.
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).send({ token });
  } catch (err) {
    if (
      err.name === "ValidationError" ||
      err.name === "DocumentNotFoundError"
    ) {
      return next(new UnauthorizedError("Incorrect email or password"));
    }
    return next(err);
  }
};

// This is a controller for a protected route.
const getCurrentUser = async (req, res, next) => {
  // This comes from the auth middleware. All protected routes will use it.
  const { _id } = req.user;

  try {
    // Query the DB for a user with this id. The mongoose method, orFail()
    //  returns a DocumentNotFoundError instead of null.
    const user = await User.findById(_id).orFail();

    res.status(200).send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Requested resource not found"));
    }
    // mongoose error of type: objectId.
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid Data"));
    }
    return next(err);
  }
};

module.exports = { register, login, getCurrentUser };
