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
      .then(({ body: { rows: topics } }) => {
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
  test("status:404, should return error message when path is not found", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route Not Found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status:200, should return a status of 200", () => {
    return request(app).get("/api/articles/5").expect(200);
  });
  test("status:200, should respond with an array of topic objects containing slug & description properties", () => {
    return request(app)
      .get("/api/articles/5")
      .then(({ body: { rows: article } }) => {
        expect(article).toBeInstanceOf(Array);

        expect(article[0]).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
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
  test("status:404, should return error message when path is not found", () => {
    return request(app)
      .get("/api/article/12")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route Not Found");
      });
  });
  test("status:404, should return error message when id given is not available", () => {
    return request(app)
      .get("/api/articles/20")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID Not Found");
      });
  });
});

// describe.only("PATCH /api/articles/:article_id", () => {
//   test("status:200, should return a status of 200", () => {
//     return request(app).patch("/api/articles/5").expect(204);
//   });
//   test("status:200, should respond with an array of topic objects containing slug & description properties", () => {
//     return request(app)
//       .get("/api/articles/5")
//       .then(({ body: { rows: article } }) => {});
//   });
//   test("status:400, should return error message when request is bad", () => {
//     return request(app)
//       .get("/api/articles/bb")
//       .expect(400)
//       .then(({ body }) => {
//         expect(body.msg).toBe("Invalid Request");
//       });
//   });
// });
