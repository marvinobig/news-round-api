const express = require("express");
const app = express();
const api_routes = require("./routes/api.router");

app.use(express.json());

app.use("/api", api_routes);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
});

module.exports = app;
