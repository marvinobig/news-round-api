const {
  fetchEndpoints,
  fetchTopics,
  fetchArticleById,
  changeArticleById,
  fetchUsers,
  fetchArticles,
  fetchArticleCommentsById,
  insertArticleCommentById,
  removeCommentsById,
  fetchUserById,
} = require("../models/api.model");

exports.getEndpointsController = async (req, res, next) => {
  const endpoints = await fetchEndpoints();
  const endpointsObj = { newsRoundApi: JSON.parse(endpoints) };

  res.status(200).send(endpointsObj);
};

exports.getTopicsController = async (req, res) => {
  const topics = await fetchTopics();
  const topicObj = { topics };

  res.status(200).send(topicObj);
};

exports.getArticleByIdController = async (req, res, next) => {
  try {
    const id = Number(req.params.article_id);
    const article = await fetchArticleById(id);
    const articleObj = { article };

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
    const updatedArticleObj = { updatedArticle };

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
    const { sort_by, order_by, filter } = req.query;
    const articles = await fetchArticles(sort_by, order_by, filter);
    const articlesObj = { articles };
    res.status(200).send(articlesObj);
  } catch (err) {
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
    const newCommentObj = { newComment };

    res.status(201).send(newCommentObj);
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentsByIdController = async (req, res, next) => {
  try {
    const id = Number(req.params.comment_id);
    const deletedComment = await removeCommentsById(id);

    if (deletedComment) res.sendStatus(204);
    else throw new Error("Comment Does Not Exist", { cause: 404 });
  } catch (err) {
    next(err);
  }
};

exports.getUserByIdController = async (req, res, next) => {
  try {
    const id = req.params.username;
    const user = await fetchUserById(id);
    const userObj = { user };

    res.status(200).send(userObj);
  } catch (err) {
    next(err);
  }
};
