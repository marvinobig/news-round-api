const express = require("express");
const router = express.Router();
const {
  getTopicsController,
  getArticleByIdController,
  updateArticleByIdController,
  getUsersController,
  getArticlesController,
} = require("../controllers/api.controller");

router.get("/topics", getTopicsController);
router.get("/articles/:article_id", getArticleByIdController);
router.patch("/articles/:article_id", updateArticleByIdController);
router.get("/users", getUsersController);
router.get("/articles", getArticlesController);

module.exports = router;
