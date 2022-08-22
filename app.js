const express = require("express");
const app = express();
const cors = require("cors");
const apiRoutes = require("./routes/api.router");
const { getEndpointsController } = require("./controllers/api.controller");

app.use(cors());
app.use(express.json());

app.get("/", getEndpointsController);
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
    res.status(404).send({ msg: "Username or Article Does Not Exist" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(err.cause).send({ msg: err.message });
});

module.exports = app;
