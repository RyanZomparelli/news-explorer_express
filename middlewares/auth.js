const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/errors/unauthorized-err");

/* Auth flow:
     0. Register (createUser).
     1. Login (login -> getUserByCredentials -> jwt.sign). Authenticate
     2. getCurrentUser (CheckAuthorization). Authorize
     */

// This middleware is the second step in my backend auth flow.
const checkAuthorization = (req, res, next) => {
  try {
    // Destructure the auth header.
    const { authorization } = req.headers;

    // Verify the format.
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError("Not authorized");
    }

    // Format the token.
    const token = authorization.replace("Bearer ", "");

    // Decode the token.
    const payload = jwt.verify(token, JWT_SECRET);

    // Create a user object off the request that contains the user from the token.
    req.user = payload;

    // Pass this req.user to the controller with express's next() middleware processing.
    return next();
  } catch (err) {
    // When you pass an argument to next it automatically triggers error handling.
    return next(err);
  }
};
