const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchEndpoints = async () => {
  const endpoints = await fs.readFile(
    `${__dirname}/../endpoints.json`,
    "utf-8"
  );

  return endpoints;
};

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics");

  return topics.rows;
};

exports.fetchArticleById = async (id) => {
  const article = await db.query(
    "SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id;",
    [id]
  );

  if (article.rows.length === 0) {
    throw new Error("ID Not Found", { cause: 404 });
  } else article.rows[0].comment_count = Number(article.rows[0].comment_count);

  return article.rows[0];
};

exports.changeArticleById = async (id, inc_votes) => {
  if (inc_votes === undefined) {
    throw new Error("Request Body is Missing Some Fields", { cause: 400 });
  }

  const changeArticle = await db.query(
    "UPDATE articles SET votes = votes + $2 WHERE article_id=$1 RETURNING *;",
    [id, inc_votes]
  );

  const updatedArticle = await db.query(
    "SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id;",
    [id]
  );

  if (changeArticle.rows.length === 0) {
    throw new Error(`Article ${id} Not Found`, { cause: 404 });
  } else
    updatedArticle.rows[0].comment_count = Number(
      updatedArticle.rows[0].comment_count
    );

  return updatedArticle.rows[0];
};

exports.fetchUsers = async () => {
  const users = await db.query("SELECT * FROM users");

  return users.rows;
};

exports.fetchArticles = async (
  sort_by = "created_at",
  order_by = "desc",
  filter = "[A-Za-z]"
) => {
  const articleOrder = order_by.toUpperCase();
  const sortByGreenList = [
    "comment_count",
    "article_id",
    "votes",
    "topic",
    "title",
    "author",
    "created_at",
  ];
  const orderByGreenList = ["DESC", "ASC"];

  if (
    !sortByGreenList.includes(sort_by) ||
    !orderByGreenList.includes(articleOrder)
  ) {
    throw new Error("Invalid Query in URL", { cause: 400 });
  }

  const articles = await db.query(
    `SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id WHERE topic ~ '${filter}' GROUP BY articles.article_id ORDER BY ${sort_by} ${articleOrder};`
  );

  articles.rows.forEach((article) => {
    article.comment_count = Number(article.comment_count);
  });

  if (articles.rows.length === 0) {
    throw new Error("No Article Exists That Matches Your Query", {
      cause: 200,
    });
  }

  return articles.rows;
};

exports.fetchArticleCommentsById = async (id) => {
  const articleComments = await db.query(
    "SELECT * FROM comments WHERE article_id=$1;",
    [id]
  );

  if (articleComments.rows.length === 0) {
    throw new Error(`Article ${id} Has no Comments`, { cause: 200 });
  }

  return articleComments.rows;
};

exports.insertArticleCommentById = async (id, commentData) => {
  const { username, body } = commentData;

  const insertComment = await db.query(
    "INSERT INTO comments(article_id, author, body) VALUES ($1, $2, $3) RETURNING *",
    [id, username, body]
  );

  return insertComment.rows[0];
};

exports.removeCommentsById = async (id) => {
  let deleted = true;
  const removeComment = await db.query(
    "DELETE FROM comments WHERE comment_id=$1 RETURNING *",
    [id]
  );

  if (removeComment.rows.length === 0) {
    deleted = false;
  }

  return deleted;
};

exports.fetchUserById = async (id) => {
  const user = await db.query("SELECT * FROM users WHERE username=$1;", [id]);

  if (user.rows.length === 0) {
    throw new Error("That User Does Not Exist", { cause: 200 });
  }

  return user.rows[0];
};

exports.removeArticleById = async (id) => {
  let deleted = true;

  const removeArticle = await db.query(
    "DELETE FROM articles WHERE article_id=$1 RETURNING *",
    [id]
  );

  if (removeArticle.rows.length === 0) {
    deleted = false;
  }

  return deleted;
};

exports.insertArticle = async (articleData) => {
  const { author, title, body, topic } = articleData;

  const insertArticle = await db.query(
    "INSERT INTO articles(author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *",
    [author, title, body, topic]
  );

  const addedArticle = await db.query(
    "SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id;",
    [insertArticle.rows[0].article_id]
  );

  addedArticle.rows[0].comment_count = Number(
    addedArticle.rows[0].comment_count
  );

  return addedArticle.rows[0];
};
