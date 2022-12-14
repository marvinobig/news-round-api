# News Round API

## Background

This project allows users to fetch articles and comments from other users, it allows users to also fetch usernames and topics from the database. Users can also partially update articles and post comments.

This is the news round API, it is your one stop for articles on numerous topics and also a place for people with similar interests to have a chat.

## Endpoints

- GET `/` -> serves up a json representation of all the available endpoints of the news-round api
- GET `/api/topics` -> serves an array of all topics
- GET `/api/articles` -> serves an array of all articles sorted by any property in the article object and/or ordered in ascending or descending order. Can also filter by topic
- GET `/api/articles/:article_id` -> serves an article object matching the given article ID
- UPDATE `/api/articles/:Article_id` -> updates the vote property of an article object matching the given article ID
- GET `/api/articles/:article_id/comments` -> serves an array of all comments on a specific article matching the given article ID
- POST `/api/articles/:article_id/comments` -> posts a comment on a specific article matching the given article ID
- GET `/api/users` -> serves an array of all users
- DELETE `/api/comments/comment_id` -> deletes a comment matching the given comment_id
- GET `/api/users/:username` -> serves an object of a user by their username
- DELETE `/api/articles/:article_id` -> deletes an article matching the given article_id
- POST `/api/articles` -> adds an article to the api

## Using The Project Locally

### Clone

To clone this repo, enter into the terminal and type

``` text
git clone https://github.com/marvinobig/news-round-api.git
```

### Install Dependencies

To install the projects dependencies, type into the terminal

``` text
npm i
```

### Setup Local Database

- To setup the databases, run
  
``` text
npm run setup-dbs
```

- To add data to the database, run

``` text
npm run seed
```
  
- To access the databases (test & development) locally, create two .env files titled (.env.test & .env.development).

### Run Tests

- To run all available test suites, run

``` text
npm run test
```

- To run a specific suite, run

``` text
npm run test app.test.js
```

or

``` text
npm run test utils.test.js
```

## Languages/Tools Used

- JavaScript
  
- Node JS (version 18.4.0)
  
- Express JS (version 4.18.1)

- PostgreSQL (version 14.3)

## Hosted API Link

[News Round API](https://news-round-api.herokuapp.com)
