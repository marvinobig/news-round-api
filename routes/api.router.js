const express = require("express");
const router = express.Router();
const { GET_TOPICS_CONTROLLER } = require("../controllers/api.controller");

router.get("/topics", GET_TOPICS_CONTROLLER);

module.exports = router;
