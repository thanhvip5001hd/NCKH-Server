const Test = require("../models/testModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { TestService } = require("../services/test.service");
const QuizModel = require("../models/quizModel");
const User = require("../models/userModel");
const { LeaderboardService } = require("../services/leaderboard.service");

exports.getLearderboardByQuiz = catchAsync(async (req, res) => {
  const newTests = await LeaderboardService.getLearderboardByQuiz(
    req.params.quizId
  );
  res.status(201).json({
    status: "success",
    data: {
      leaderboard: newTests,
    },
  });
});

exports.updateLeaderboard = catchAsync(async (req, res) => {
  const newTests = await LeaderboardService.updateLeaderboard(req.body);
  res.status(201).json({
    status: "success",
    data: {
      leaderboard: newTests,
    },
  });
});
