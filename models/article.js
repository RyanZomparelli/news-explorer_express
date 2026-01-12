const mongoose = require("mongoose");
const validator = require("validator");

const articleSchema = new mongoose.Schema({
  keyword: {
    required: true,
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
  text: {
    required: true,
    type: String,
  },
  date: {
    required: true,
    type: String,
  },
  source: {
    required: true,
    type: String,
  },
  link: {
    required: true,
    type: String,
    validator: {
      validate: (url) => validator.isURL(url),
      message: "Invalid URL. Please try again",
    },
  },
  image: {
    required: true,
    type: String,
    validator: {
      validate: (url) => validator.isURL(url),
      message: "Invalid URL. Please try again",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("article", articleSchema);
