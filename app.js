const express = require("express");
const app = express();
const router = app.Router();

app.use(express.json());

module.exports = { app, router };
