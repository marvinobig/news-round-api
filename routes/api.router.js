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
} = require("../controllers/api.controller");

router.get("/topics", getTopicsController);
router.get("/articles/:article_id", getArticleByIdController);
router.patch("/articles/:article_id", updateArticleByIdController);
router.get("/users", getUsersController);
router.get("/articles", getArticlesController);
router.get("/articles/:article_id/comments", getArticleCommentsByIdController);
router.post("/articles/:article_id/comments", postArticleCommentByIdController);
router.delete("/comments/:comment_id", deleteCommentsByIdController);

module.exports = router;
