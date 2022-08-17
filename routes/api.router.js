const express = require("express");
const router = express.Router();
const {
  getTopicsController,
  getArticleByIdController,
  updateArticleByIdController,
  getUsersController,
  getArticlesController,
  getArticleCommentsByIdController,
  postArticleCommentByIdController,
  deleteCommentsByIdController,
  getUserByIdController,
  deleteArticleByIdController,
  postArticlesController,
} = require("../controllers/api.controller");

router.get("/topics", getTopicsController);
router.get("/articles", getArticlesController);
router.post("/articles", postArticlesController);
router.get("/articles/:article_id", getArticleByIdController);
router.patch("/articles/:article_id", updateArticleByIdController);
router.get("/articles/:article_id/comments", getArticleCommentsByIdController);
router.post("/articles/:article_id/comments", postArticleCommentByIdController);
router.get("/users", getUsersController);
router.get("/users/:username", getUserByIdController);
router.delete("/comments/:comment_id", deleteCommentsByIdController);
router.delete("/articles/:article_id", deleteArticleByIdController);

module.exports = router;
