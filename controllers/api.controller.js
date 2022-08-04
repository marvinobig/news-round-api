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
  const topicObj = { topics };

  res.status(200).send(topicObj);
};

exports.getArticleByIdController = async (req, res, next) => {
  try {
    const id = Number(req.params.article_id);
    const article = await fetchArticleById(id);
    const articleObj = { article: article[0] };

    res.status(200).send(articleObj);
  } catch (err) {
    next(err);
  }
};

exports.updateArticleByIdController = async (req, res, next) => {
  try {
    const id = Number(req.params.article_id);
    const inc_votesNum = req.body.inc_votes;
    const updatedArticle = await changeArticleById(id, inc_votesNum);
    const updatedArticleObj = { updatedArticle: updatedArticle[0] };

    res.status(200).send(updatedArticleObj);
  } catch (err) {
    next(err);
  }
};

exports.getUsersController = async (req, res) => {
  const users = await fetchUsers();
  const usersObj = { users };
  res.status(200).send(usersObj);
};

exports.getArticlesController = async (req, res, next) => {
  try {
    const { sort_by, order_by } = req.query;
    const articles = await fetchArticles(sort_by, order_by);
    const articlesObj = { articles };
    res.status(200).send(articlesObj);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getArticleCommentsByIdController = async (req, res, next) => {
  try {
    const id = Number(req.params.article_id);
    const articleComments = await fetchArticleCommentsById(id);
    const articleCommentsObj = { articleComments };

    res.status(200).send(articleCommentsObj);
  } catch (err) {
    next(err);
  }
};

exports.postArticleCommentByIdController = async (req, res, next) => {
  try {
    const commentData = req.body;
    const id = Number(req.params.article_id);
    const newComment = await insertArticleCommentById(id, commentData);
    const newCommentObj = { newComment: newComment[0] };

    res.status(201).send(newCommentObj);
  } catch (err) {
    next(err);
  }
};
