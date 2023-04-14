const jwt = require("jsonwebtoken");
const { promisify } = require("util");
// promisify: chuyển đổi 1 function callback trả
// về 1 function trả về 1 Promise
const crypto = require("crypto");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  // 1. Tạo mã JWT
  const token = signToken(user._id);

  // 2. Gửi 1 cookie đến client
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // (cookie sẽ hết hạn trong)
    // secure: true,
    // (cookie sẽ chỉ dc gửi trên 1 kết nối dc mã hóa (https)),
    httpOnly: true,
    // (trình duyệt ko thể truy cập hoặc sửa đổi cookie)
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Xóa mkhau khỏi DB
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  // Tạo mã JWT token
  createSendToken(newUser, 201, res);
});

exports.signUpWithGoogle = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
  } else {
    createSendToken(user, 200, res);
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // B1: Check if email và password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // B2: Check if user exists
  const user = await User.findOne({ email }).select("+password");

  // *Ktra xem mkau của ng dùng gửi = vs mkau trg CSDL k
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 401));
  }
  // B3: Send token to client
  createSendToken(user, 200, res);
});

// Ktra xem ng dùng login chưa phía frontend
exports.onAuthStateChanged = async (req, res) => {
  try {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.json({
        isLogin: false,
        message: "You are not logged in! Please log in to get access.",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // Lấy thông tin ng dùng hiện tại

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.json({
        isLogin: false,
        message: "The user belonging to this token does no longer exist.",
      });
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.json({
        isLogin: false,
        message: "User recently changed password! Please log in again.",
      });
    }

    res.json({
      isLogin: true,
      user: currentUser,
    });
  } catch (err) {
    res.json({
      isLogin: false,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Nhận token từ headers của req
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2. Ktra xem mã token hợp lệ k
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3. Ktra xem ng dùng có tồn tại hay k
  // (ta sẽ ktra dựa vào id vì trg phần payload của token có chứa id)
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist.")
    );
  }
  // 4. Ktra xem sau khi mã JWT dc phát hành thì ng dùng có thay đổi mkhau k
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  // (decoded.iat : thời gian mã token đc tạo ra)

  // 5. Truyền thông tin user cho những middleware đằng sau
  // thằng này
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  // 1. Get user based on user email (from Post req)
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }
  // 2. Tạo 1 mã token ngẫu nhiên
  // (Trong userModel tạo 1 hàm static createPasswordToken)
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // (Lưu resetToken vào DB (và ta sẽ ko validate trong trường hợp này)
  // 3. Send it to user's email
  // (đường dẫn mà ng dùng nhấn vào để lấy lại mkhau)

  // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    // (resetToken là token chưa dc mã hóa)

    await new Email(user, resetToken).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    console.log(err);
    // Reset mã tbao token và thời gian token hết hạn
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
};
exports.resetPassword = async (req, res, next) => {
  // 1. Lấy ng dùng dựa vào mã token trên req
  // (ta sẽ mã hóa token ban đầu 1 lần nữa sau đó
  // ta sẽ so sánh vs token đã dc mã hóa trong DB)
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2. Nếu token chưa hết hạn, và ng dùng tồn tại
  // => set new Password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3. Update thuộc tính changedPasswordAt của ng
  // dùng đó
  // (ta sẽ viết hàm này bên userModel)
  // 4. Đăng nhập ng dùng (cơ bản là gửi mã JWT)
  createSendToken(user, 200, res);
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Lấy ng dùng từ Collection
  const user = await User.findById(req.user.id).select("+password");
  // (req.user.id đến từ req của hàm protect)
  // 2. Ktra xem mkhau ng dùng đưa có đúng k

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }
  // 3. Nếu đúng cập nhật lại mkhau
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4. Đăng nhập lại ng dùng
  // (để gửi mã JWT cho ng dùng)
  createSendToken(user, 200, res);
});
