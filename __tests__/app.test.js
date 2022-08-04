const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("status:200, should return a status of 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("status:200, should respond with an array of topic objects containing slug & description properties", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);

        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  testFor404("get", "/api/topics", "/api/topic");
});

describe("GET /api/articles/:article_id", () => {
  test("status:200, should return a status of 200", () => {
    return request(app).get("/api/articles/5").expect(200);
  });
  test("status:200, should respond with an array of an article object with article_id, title, topic, author, body, created_at, votes & comment_count properties", () => {
    return request(app)
      .get("/api/articles/5")
      .then(({ body: { article } }) => {
        expect(article).toBeInstanceOf(Object);

        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
        expect(article.comment_count).toBe(2);
      });
  });
  test("status:400, should return error message when request is bad", () => {
    return request(app)
      .get("/api/articles/bb")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
  testFor404("get", "/api/articles/:article_id", "/api/article/5");
  test("status:404, should return error message when id given is not available", () => {
    return request(app)
      .get("/api/articles/20")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID Not Found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status:200, should return a status of 200", () => {
    const inc_votes = { inc_votes: 2 };
    return request(app).patch("/api/articles/5").send(inc_votes).expect(200);
  });
  test("status:200, should return the article with the vote property updated", async () => {
    const inc_votes = { inc_votes: 2 };
    const article = await request(app)
      .get("/api/articles/5")
      .then(({ body: { article } }) => {
        return article;
      });

    return request(app)
      .patch("/api/articles/5")
      .send(inc_votes)
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        article.votes += inc_votes.inc_votes;

        expect(article).toEqual(updatedArticle);
      });
  });
  test("status:400, should return error when given a bad object in the request body", () => {
    const inc_votes = { inc_votes: "fff" };

    return request(app)
      .patch("/api/articles/5")
      .send(inc_votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
  test("status:400, should return error when given an empty object", () => {
    const inc_votes = {};
    return request(app)
      .patch("/api/articles/5")
      .send(inc_votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Request Body is Missing Some Fields");
      });
  });
  test("status:404, should return error when article does not exist", () => {
    const inc_votes = { inc_votes: 2 };
    return request(app)
      .patch("/api/articles/100")
      .send(inc_votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article 100 Not Found");
      });
  });
});

describe("GET /api/users", () => {
  test("status:200, should return a status of 200", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("status:200, should respond with an array of user objects containing username, name & avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);

        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  testFor404("get", "/api/users", "/api/user");
});

describe("GET /api/articles", () => {
  test("status:200, should return a status of 200", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("status:200, should respond with an array of an article objects containing article_id, title, topic, author, body, created_at, votes & comment_count properties", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("status:200, should respond with array of article objects ordered by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body: { articles } }) => {
        let isOrdered = true;

        for (let i = 1; i < articles.length; i++) {
          if (articles[i].created_at > articles[i - 1].created_at) {
            isOrdered = false;
          }
        }

        expect(isOrdered).toBe(true);
      });
  });
  testFor404("get", "/api/articles", "/api/article");
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status:200, should return a status of 200", () => {
    return request(app).get("/api/articles/5/comments").expect(200);
  });
  test("status:200, should respond with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .then(({ body: { articleComments } }) => {
        expect(articleComments).toBeInstanceOf(Array);

        articleComments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("status:200, should respond with a message when id given has no comments", () => {
    return request(app)
      .get("/api/articles/20/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("Article 20 Has no Comments");
      });
  });
  test("status:400, should return error when given a bad id in the url path", () => {
    return request(app)
      .get("/api/articles/fff/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
  testFor404(
    "get",
    "/api/articles/:article_id/comments",
    "/api/article/5/comment"
  );
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status:201, should respond with the object that was sent", () => {
    const newComment = { username: "rogersop", body: "this rocks" };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { newComment } }) => {
        expect(newComment).toBeInstanceOf(Object);

        expect(newComment).toEqual(
          expect.objectContaining({
            article_id: 5,
            author: "rogersop",
            body: "this rocks",
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("status:400, should respond with error message when given an empty object", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Request Body is Missing Some Fields");
      });
  });
  test("status:404, should respond with error message when given username that does not exist", () => {
    const newComment = { username: 444, body: "" };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username or Article Does Not Exist");
      });
  });
  test("status:404, should respond with an error message when given article does not exist", () => {
    const newComment = { username: "rogerso", body: "this rocks" };
    return request(app)
      .post("/api/articles/100/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username or Article Does Not Exist");
      });
  });
});

function testFor404(method, path, path404) {
  describe(`404 test for ${method.toUpperCase()} ${path}`, () => {
    test("status:404, should return error message when path is not found", () => {
      return request(app)
        .get(`${path404}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Route Not Found");
        });
    });
  });
}
