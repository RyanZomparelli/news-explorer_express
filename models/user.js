const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UnauthorizedError = require("../utils/errors/unauthorized-err");

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: "Email is invalid. Please try again.",
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

/*
In the static method below I declare the name twice. Once for the object property,
and once for the function name. The property name is for accessing the function,
but the function's internal name is what shows up in stack traces and debugging tools.

With both names:
userSchema.statics.findUserByCredentials = async function findUserByCredentials() {
  JavaScript creates a function object with name: "findUserByCredentials"
  Then assigns it to the property "findUserByCredentials"
Error: Incorrect email or password
    at findUserByCredentials

Without the function name:
userSchema.statics.findUserByCredentials = async function() {
  JavaScript creates an anonymous function object with name: ""
  Then assigns it to the property "findUserByCredentials"
Error: Incorrect email or password
    at <anonymous>
*/

// This is the first step in the auth flow. Authentication before authorization.
userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password,
) {
  // Find user by email and return their hashed password from the db.
  // This is a static method and can be used on all instances of the User class.
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    return Promise.reject(new UnauthorizedError("Incorrect email or password"));
  }

  // Hash the login password and compare it to the db password hash.
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return Promise.reject(new UnauthorizedError("Incorrect email or password"));
  }

  return user;
};

module.exports = mongoose.model("user", userSchema);
