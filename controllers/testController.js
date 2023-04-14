const Test = require("../models/testModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { TestService } = require("../services/test.service");
const QuizModel = require("../models/quizModel");
const User = require("../models/userModel");

exports.createTest = catchAsync(async (req, res) => {
  const newTests = await TestService.createTest(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tests: newTests,
    },
  });
});

exports.upload = catchAsync(async (req, res) => {
  res.status(201).json({
    status: "success",
  });
});

exports.test = catchAsync(async (req, res) => {
  // const newTests = await QuizModel.find();
  const newTests = await TestService.test();
  res.status(201).json({
    status: "success",
    data: {
      tests: newTests,
    },
  });
});

exports.getTest = catchAsync(async (req, res, next) => {
  const test = await TestService.getTest(req.params.id);

  if (!test) {
    return next(new AppError("No test found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      test,
    },
  });
});
