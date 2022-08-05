const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

const db = new Pool(config);

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABSE_URL not set");
}

module.exports = db;
