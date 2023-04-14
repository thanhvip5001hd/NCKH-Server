const catchAsync = require("../utils/catchAsync");
const Schedule = require("../models/scheduleModel");
const AppError = require("../utils/appError");
const { ScheduleService } = require("../services/schedule.service");

exports.createSchedule = catchAsync(async (req, res) => {
  const newSchedule = await ScheduleService.createSchedule(req.body);
  res.status(201).json({
    status: "success",
    data: {
      schedule: newSchedule,
    },
  });
});

exports.getAllSchedule = catchAsync(async (req, res) => {
  const schedules = await ScheduleService.getAllSchedule(req.params);

  res.status(200).json({
    status: "success",
    results: schedules.length,
    data: {
      schedules,
    },
  });
});

exports.getSchedule = catchAsync(async (req, res, next) => {
  const schedule = await ScheduleService.getSchedule(req.params.id);

  if (!schedule) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      schedule,
    },
  });
});

exports.updateSchedule = catchAsync(async (req, res, next) => {
  const schedule = await ScheduleService.updateSchedule(
    req.params.id,
    req.body
  );

  if (!schedule) {
    return next(new AppError("No schedule found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      schedule,
    },
  });
});

exports.deleteSchedule = catchAsync(async (req, res, next) => {
  console.log("req.params.id: ", req.params.id);
  const schedule = await ScheduleService.deleteSchedule(req.params.id);
  if (!schedule) {
    return next(new AppError("No booking found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
