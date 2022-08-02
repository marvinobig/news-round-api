const {
  fetchTopics,
  fetchArticleById,
  updateArticleById,
} = require("../models/api.model");

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

exports.updateArticleByIdController = async (req, res, next) => {
  try {
    const id = Number(req.params.article_id);
    const newVoteNum = req.body.newVote;
    const uppdatedArticle = await updateArticleById(id, newVoteNum);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
