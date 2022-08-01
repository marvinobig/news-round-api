const { fetchTopics, fetchArticleById } = require("../models/api.model");

exports.get_topics_controller = async (req, res, next) => {
  const topics = await fetchTopics();

  res.status(200).send(topics);
};

exports.get_article_by_id_controller = async (req, res, next) => {
  try {
    const id = Number(req.params.article_id);
    const article = await fetchArticleById(id);

    res.status(200).send(article);
  } catch (err) {
    console.log(err, "controller");
    next(err);
  }
};
