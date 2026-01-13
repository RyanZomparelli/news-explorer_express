const Article = require("../models/article");

const BadRequestError = require("../utils/errors/bad-request-err");
const ForbiddenError = require("../utils/errors/forbidden-err");
const NotFoundError = require("../utils/errors/not-found-err");

const getArticles = async (req, res, next) => {
  // For protected operations, always use the _id I extracted from the jwt in the auth middleware.
  const { _id } = req.user;
  try {
    // Return all articles that match this owner.
    const articles = await Article.find({ owner: _id }).select("+owner");
    res.status(200).send(articles);
  } catch (err) {
    return next(err);
  }
};

const saveArticle = async (req, res, next) => {
  const { _id } = req.user;
  const { keyword, title, text, date, source, link, image } = req.body;
  try {
    // Don't forget to add the owner _id!
    const article = await Article.create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner: _id,
    });

    res.status(201).send(article);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    return next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  const { id } = req.params;
  try {
    const article = await Article.findById(id).select("+owner").orFail();
    // Reduce the id's to strings because mongoose ObjectId's can evaluate to !== even if they match.
    if (article.owner.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Access denied");
    }
    // Already have the specific article in question. Can use this instance method.
    await article.deleteOne();
    res.status(200).send({ message: "Article deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid data"));
    }
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Requested resource not found"));
    }
    return next(err);
  }
};

module.exports = { getArticles, saveArticle, deleteArticle };
