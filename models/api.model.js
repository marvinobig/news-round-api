const db = require("../db/connection");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics");

  return topics.rows;
};

exports.fetchArticleById = async (id) => {
  const article = await db.query(
    "SELECT * FROM articles WHERE article_id=$1;",
    [id]
  );
  const commentsNum = await db.query(
    "SELECT comments.body FROM articles JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id=$1;",
    [id]
  );

  if (article.rows.length === 0) {
    throw new Error("ID Not Found", { cause: 404 });
  } else article.rows[0]["comment_count"] = commentsNum.rowCount;

  return article.rows;
};

exports.updateArticleById = async (id, inc_votes) => {
  if (inc_votes === undefined) {
    throw new Error("Request Body is Missing Some Fields", { cause: 400 });
  }

  const updatedArticle = await db.query(
    "UPDATE articles SET votes = votes + $2 WHERE article_id=$1 RETURNING *;",
    [id, inc_votes]
  );
  const commentsNum = await db.query(
    "SELECT comments.body FROM articles JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id=$1;",
    [id]
  );

  if (updatedArticle.rows.length === 0) {
    throw new Error(`Article ${id} Not Found`, { cause: 404 });
  } else updatedArticle.rows[0]["comment_count"] = commentsNum.rowCount;

  return updatedArticle;
};

exports.fetchUsers = async () => {
  const users = await db.query("SELECT * FROM users");

  return users.rows;
};
