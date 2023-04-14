const Set = require("../models/setModel");
const { ReviewService } = require("../services/review.service");
const { SetService } = require("../services/set.service");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createReviewQuestions = catchAsync(async (req, res) => {
  const score = await ReviewService.createReviewQuestions(req.body.data);

  res.status(201).json({
    score,
  });
});

exports.markReviewTestDone = catchAsync(async (req, res, next) => {
  const reviewTest = await ReviewService.markReviewTestDone(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      reviewTest,
    },
  });
});

exports.getReviewTestById = catchAsync(async (req, res, next) => {
  const reviewTest = await ReviewService.getReviewTestById(req.params.id);

  if (!reviewTest) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: reviewTest,
  });
});

exports.getTodayReviewTests = catchAsync(async (req, res, next) => {
  const reviewTests = await ReviewService.getTodayReviewTests();

  res.json({
    status: "success",
    data: reviewTests,
  });
});
