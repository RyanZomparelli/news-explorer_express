const router = require("express").Router();
const {
  getArticles,
  saveArticle,
  deleteArticle,
} = require("../controllers/articles");

router.get("/", getArticles);
router.post("/", saveArticle);
// : for dynamic request parameters.
router.delete("/:articleId", deleteArticle);

module.exports = router;
