const UserTestHistory = require("../models/userTestHistoryModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { AnswerHistoryService } = require("../services/answerHistory.service");

exports.createAnswerHistory = catchAsync(async (req, res) => {
  const newTestHistory = await AnswerHistoryService.createAnswerHistory(
    req.body
  );

  res.status(201).json({
    status: "success",
    data: {
      testHistory: newTestHistory,
    },
  });
});

exports.getAnswerHistory = catchAsync(async (req, res, next) => {
  const { testId } = req.body;
  const testHistory = await AnswerHistoryService.getAnswerHistory({ testId });

  res.status(200).json({
    status: "success",
    data: {
      testHistory,
    },
  });
});
