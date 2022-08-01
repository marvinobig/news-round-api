const { fetchTopics } = require("../models/api.model");

exports.GET_TOPICS_CONTROLLER = async (req, res, next) => {
  const topics = await fetchTopics();

  res.status(200).send(topics);
};
