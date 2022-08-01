const express = require("express");
const router = express.Router();
const {
  get_topics_controller,
  get_article_by_id_controller,
} = require("../controllers/api.controller");

router.get("/topics", get_topics_controller);
router.get("/articles/:article_id", get_article_by_id_controller);

module.exports = router;
