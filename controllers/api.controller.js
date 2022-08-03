const {
  fetchTopics,
  fetchArticleById,
  changeArticleById,
  fetchUsers,
  fetchArticles,
  fetchArticleCommentsById,
  insertArticleCommentById,
} = require("../models/api.model");

exports.getTopicsController = async (req, res) => {
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
    const inc_votesNum = req.body.inc_votes;
    const updatedArticle = await changeArticleById(id, inc_votesNum);

    res.status(200).send(updatedArticle.rows);
  } catch (err) {
    next(err);
  }
};

exports.getUsersController = async (req, res) => {
  const users = await fetchUsers();
  res.status(200).send(users);
};

exports.getArticlesController = async (req, res) => {
  const articles = await fetchArticles();
  res.status(200).send(articles);
};

exports.getArticleCommentsByIdController = async (req, res, next) => {
  try {
    const id = Number(req.params.article_id);
    const articleComments = await fetchArticleCommentsById(id);

    res.status(200).send(articleComments);
  } catch (err) {
    next(err);
  }
};

exports.postArticleCommentByIdController = async (req, res, next) => {
  try {
    const commentData = req.body;
    const id = Number(req.params.article_id);
    const newComment = await insertArticleCommentById(id, commentData);

    res.status(200).send(newComment);
  } catch (err) {
    next(err);
  }
};
