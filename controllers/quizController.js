const Test = require("../models/testModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { TestService } = require("../services/test.service");
const QuizModel = require("../models/quizModel");
const User = require("../models/userModel");
const { QuizService } = require("../services/quiz.service");

exports.createQuiz = catchAsync(async (req, res) => {
  const newTests = await QuizService.createQuiz(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tests: newTests,
    },
  });
});

exports.recommendQuizzes = catchAsync(async (req, res) => {
  const quizzes = await QuizService.recommendQuizzes(req.params.id);
  res.status(201).json({
    status: "success",
    data: {
      quizzes,
    },
  });
});

exports.getAllQuizzes = catchAsync(async (req, res, next) => {
  const quizzes = await QuizService.getAllQuizzes();

  if (!quizzes) {
    return next(new AppError("No test found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      quizzes,
    },
  });
});

exports.getQuizById = catchAsync(async (req, res, next) => {
  const quizzes = await QuizService.getQuizById(req.params.id);

  if (!quizzes) {
    return next(new AppError("No test found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      test: quizzes,
    },
  });
});
