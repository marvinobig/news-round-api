const db = require("../db/connection");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics");

  return topics;
};

exports.fetchArticleById = async (id) => {
  const article = await db.query("SELECT * FROM articles WHERE article_id=$1", [
    id,
  ]);

  return article;
};
