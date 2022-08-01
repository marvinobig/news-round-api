const { fetchTopics, fetchArticleById } = require("../models/api.model");

exports.getTopicsController = async (req, res, next) => {
  const topics = await fetchTopics();

  res.status(200).send(topics);
};

exports.getArticleByIdController = async (req, res, next) => {
  try {
    const id = Number(req.params.article_id);
    const article = await fetchArticleById(id);
    res.status(200).send(article);
  } catch (err) {
    next(err);
  }
};
