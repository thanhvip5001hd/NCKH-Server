const express = require("express");
const reviewQuestionController = require("../controllers/reviewQuestionController");

const reviewQuestionRouter = express.Router();

// Url full: http://localhost:3000/api/v1/leaderboard
reviewQuestionRouter
  .route("/")
  .get(reviewQuestionController.getTodayReviewTests)
  .put(reviewQuestionController.createReviewQuestions);
// req.body cho PUT
// {
//   "data": [
//       {
//           "question": "6408171b45fc9c15f5615060",
//           "rating": 5,
//           "user": "64080fe4a7afbbc02086c5cc",
//           "easiness": 2.6,
//           "interval": 1,
//           "repetitions": 1
//       },
//       {
//           "question": "6408171b45fc9c15f5615061",
//           "rating": 0,
//           "user": "64080fe4a7afbbc02086c5cc",
//           "easiness": 1.7,
//           "interval": 1,
//           "repetitions": 0
//       }
//   ]
// }

// Url full: http://localhost:3000/api/v1/leaderboard/640814263540faff47c65d07
reviewQuestionRouter
  .route("/:id")
  .get(reviewQuestionController.getReviewTestById)
  .put(reviewQuestionController.markReviewTestDone);

module.exports = { reviewQuestionRouter };
