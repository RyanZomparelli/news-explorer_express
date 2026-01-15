const router = require("express").Router();
const {
  getArticles,
  saveArticle,
  deleteArticle,
} = require("../controllers/articles");
const {
  validateArticleBody,
  validateId,
} = require("../middlewares/validation");

router.get("/", getArticles);
router.post("/", validateArticleBody, saveArticle);
// : for dynamic request parameters.
router.delete("/:articleId", validateId, deleteArticle);

module.exports = router;
