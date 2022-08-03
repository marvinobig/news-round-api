const db = require("../db/connection");

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

  return article.rows;
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

  return updatedArticle;
};

exports.fetchUsers = async () => {
  const users = await db.query("SELECT * FROM users");

  return users.rows;
};

exports.fetchArticles = async () => {
  const articles = await db.query(
    "SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
  );

  articles.rows.forEach((article) => {
    article.comment_count = Number(article.comment_count);
  });

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

  return insertComment.rows;
};
