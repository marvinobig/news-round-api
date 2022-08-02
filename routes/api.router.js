const express = require("express");
const router = express.Router();
const {
  getTopicsController,
  getArticlesController,
  getArticleByIdController,
  updateArticleByIdController,
} = require("../controllers/api.controller");

router.get("/topics", getTopicsController);
router.get("/articles", getArticlesController);
router.get("/articles/:article_id", getArticleByIdController);
router.patch("/articles/:article_id", updateArticleByIdController);

module.exports = router;
