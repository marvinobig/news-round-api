const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const endpointData = require("../endpoints");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("status:200, should respond with a status of 200 and an object containing info on endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { newsRoundApi } }) => {
        expect(newsRoundApi).toEqual(endpointData);
      });
  });
  testFor404("get", "/api", "/apis", "Route Not Found");
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
  testFor404("get", "/api/topics", "/api/topic", "Route Not Found");
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
  testForSorting();
  testForSorting("article_id");
  testForSorting("votes");
  testForSorting("comment_count");
  testForSorting("article_id", "asc");
  test("status:200, should respond with an array of objects with the same topics", () => {
    return request(app)
      .get("/api/articles?filter=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: "mitch",
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
  test("status:200, should respond with a message when articles with a given topic do not exist", () => {
    return request(app)
      .get("/api/articles?filter=YO")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("No Article Exists That Matches Your Query");
      });
  });
  testFor400("sort_by=DROP;&order_by=asc");
  testFor404("get", "/api/articles", "/api/article", "Route Not Found");
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
  testFor404(
    "get",
    "/api/articles/:article_id",
    "/api/article/5",
    "Route Not Found"
  );
  test("status:404, should return error message when id given is not available", () => {
    return request(app)
      .get("/api/articles/20")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID Not Found");
      });
  });
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
    "/api/article/5/comment",
    "Route Not Found"
  );
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
  testFor404("get", "/api/users", "/api/user", "Route Not Found");
});

describe("GET /api/users/:username", () => {
  test("status:200, should respond with a status of 200 and an object with username, avatar_url & name properties", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toBeInstanceOf(Object);

        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            avatar_url: expect.any(String),
            name: expect.any(String),
          })
        );
      });
  });
  test("status:200, should return message when id given is not available", () => {
    return request(app)
      .get("/api/users/20")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("That User Does Not Exist");
      });
  });
  testFor404(
    "get",
    "/api/users/:username",
    "/api/user/rogersop",
    "Route Not Found"
  );
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

describe("DELETE /api/comments/:comment_id", () => {
  test("status:204, should return a status of 204", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });
  test("status:400, should return an error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/fff")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
  testFor404(
    "get",
    "/api/comments/:comment_id",
    "/api/comment/5",
    "Route Not Found"
  );
  test("status:404, should return error message when id given does not exist", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment Does Not Exist");
      });
  });
});

function testFor404(method, path, path404, msg = "Route Not Found") {
  describe(`404 test for ${method.toUpperCase()} ${path}`, () => {
    test("status:404, should return error message when path is not found", () => {
      return request(app)
        .get(`${path404}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(msg);
        });
    });
  });
}

function testFor400(query) {
  test("status:400, should respond with an error message for incorrect query", () => {
    return request(app)
      .get(`/api/articles?${query}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Query in URL");
      });
  });
}

function testForSorting(sort_by = "created_at", order_by = "desc") {
  test(`status:200, should respond with array of article objects sorted by ${sort_by} in ${order_by.toUpperCase()} order`, () => {
    return request(app)
      .get(`/api/articles?sort_by=${sort_by}&order_by=${order_by}`)
      .expect(200)
      .then(({ body: { articles } }) => {
        if (order_by === "desc") {
          expect(articles).toBeSortedBy(sort_by, { descending: true });
        } else {
          expect(articles).toBeSortedBy(sort_by);
        }
      });
  });
}
