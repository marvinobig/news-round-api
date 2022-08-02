const db = require("../db/connection");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics");

  return topics;
};

exports.fetchArticleById = async (id) => {
  const article = await db.query("SELECT * FROM articles WHERE article_id=$1", [
    id,
  ]);

  if (article.rows.length === 0) {
    throw new Error("ID Not Found", { cause: 404 });
  } else return article;
};

exports.updateArticleById = async (id, inc_votes) => {
  if (inc_votes === undefined) {
    throw new Error("Request Body is Missing Some Fields", { cause: 400 });
  }

  const updatedArticle = await db.query(
    "UPDATE articles SET votes = votes + $2 WHERE article_id=$1 RETURNING *;",
    [id, inc_votes]
  );

  if (updatedArticle.rows.length === 0) {
    throw new Error(`Article ${id} Not Found`, { cause: 404 });
  }
};
