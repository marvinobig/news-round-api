const express = require("express");
const app = express();
const apiRoutes = require("./routes/api.router");

app.use(express.json());

app.use("/api", apiRoutes);

////////////////////////////////////////////////////////////////////////////////

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Request Body is Missing Some Fields" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Request Body Includes Incorrect Data" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(err.cause).send({ msg: err.message });
});

module.exports = app;
