const express = require("express");
const leaderboardController = require("../controllers/leaderboardController");

const leaderboardRouter = express.Router();

// Url full: http://localhost:3000/api/v1/leaderboard
leaderboardRouter.route("/").put(leaderboardController.updateLeaderboard);
// req.body cho PUT
//   {
//     "recentScore": 11,
//     "user": "64080fe4a7afbbc02086c5cc",
//     "quiz": "640814263540faff47c65d06"
//    }

// Url full: http://localhost:3000/api/v1/leaderboard/640814263540faff47c65d07
leaderboardRouter
  .route("/:quizId")
  .get(leaderboardController.getLearderboardByQuiz);

module.exports = { leaderboardRouter };
