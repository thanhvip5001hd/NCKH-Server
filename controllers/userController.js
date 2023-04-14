const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const factory = require("./handlerFactory");
const { UserService } = require("../services/user.service");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllSetOfUser = catchAsync(async (req, res, next) => {
  console.log("hellosss");
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // B1: Tạo lỗi nếu ng dùng yêu cầu cập nhật mkhau
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }
  // B2: Lọc ra tên các trường cần cập nhật
  const filteredBody = filterObj(req.body, "name", "email");
  // B3: Cập nhật dữ liệu ng dùng
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    user: updateUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getProfileData = catchAsync(async (req, res, next) => {
  const data = await UserService.getProfileInfo(req.params.userId);

  res.json({
    status: "success",
    data,
  });
});

exports.updateLearningStreak = catchAsync(async (req, res, next) => {
  const data = await UserService.updateLearningStreak(req.params.userId);

  res.json({
    status: "success",
    data,
  });
});

exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
  res.status(201).json({
    status: "success",
  });
};

exports.getAllUsers = factory.getAll(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
