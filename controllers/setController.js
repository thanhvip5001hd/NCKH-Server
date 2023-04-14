const Set = require("../models/setModel");
const { SetService } = require("../services/set.service");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createSet = catchAsync(async (req, res) => {
  const newSets = await SetService.createSet(req.body);

  res.status(201).json({
    status: "succes",
    data: {
      sets: newSets,
    },
  });
});

exports.getSetById = catchAsync(async (req, res, next) => {
  const sets = await SetService.getSetById(req.params.setId);
  console.log(sets);

  if (!sets) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      sets,
    },
  });
});

exports.getSets = catchAsync(async (req, res, next) => {
  const sets = await SetService.getSets(req.params.userId);

  if (!sets) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      sets,
    },
  });
});

exports.updateSet = catchAsync(async (req, res, next) => {
  const set = await SetService.updateSet(req, res);

  if (!set) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: set,
  });
});

exports.deleteSet = catchAsync(async (req, res, next) => {
  const set = await SetService.deleteSet(req.params.setId);
  if (!set) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
