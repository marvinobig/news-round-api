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
      .then(({ body: { rows } }) => {
        const topics = rows;
        console.log(topics, "test");
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
