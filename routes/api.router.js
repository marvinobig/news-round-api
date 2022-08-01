const express = require("express");
const router = express.Router();
const {
  getTopicsController,
  getArticleByIdController,
} = require("../controllers/api.controller");

router.get("/topics", getTopicsController);
router.get("/articles/:article_id", getArticleByIdController);

module.exports = router;
