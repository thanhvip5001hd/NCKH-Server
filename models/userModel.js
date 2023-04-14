const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const types = ["default", "google", "facebook"];
const typesForUnrequired = ["google", "facebook"];

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name."],
    },
    email: {
      type: String,
      required: [true, "Please provide your email."],
      unique: true,
      lowercase: true,
      // Email đúng định dạng
      validator: [validator.isEmail, "Please provide a valid email"],
    },
    avatarUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn9ZaICvJMOGSbKmoSCbt08xi2-o-sMqmFuEsqE2M&s",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [isUnRequired, "Please provide a password"],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [isUnRequired, "Please confirm your password"],
      // passwordConfirm phải bằng passworđ
      validate: {
        validator: function (el) {
          return el === this.password;
        },

        message: "Passwords are not the same.",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    typeAccount: {
      type: String,
      default: "default",
      enum: types,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    friends: [
      {
        type: Schema.Types.Object,
        ref: "User",
      },
    ],
    rooms: [
      {
        type: Schema.Types.Object,
        ref: "Conversation",
      },
    ],
    paidAmount: { type: Number },
    streaks: [{ type: String }],
    maxStreak: { type: Number, default: 0 },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate cho tất cả các query dùng find
// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "classes",
//   });
//   next();
// });

// Virtual populate (tạo 1 mảng chứa id của các class nhưng ko lưu vào CSDL)
userSchema.virtual("");

// * Các thằng có typeAccount là facebook và google sẽ ko
// phải validate
function isUnRequired() {
  if (typesForUnrequired.indexOf(this.typeAccount) > -1) {
    return false;
  }
  return true;
}

// 5. Tạo populate ảo các reviews của user
// (Virtual Populate)
userSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "user",
  // (field user bên Reviews để tham chiếu tới)
  localField: "_id",
});

// 3. Hàm update passwordChangedAt
userSchema.pre("save", function (next) {
  // Nếu mkhau chưa dc sửa thì sang middleware khác
  // hoặc ng dùng mới đc tạo ra
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// 2. Mã hóa mật khẩu (trc khi lưu vào CSDL)
userSchema.pre("save", async function (next) {
  // B1: Nếu mật khẩu chưa dc sửa thì ta sẽ sang midware tiếp
  if (!this.isModified("password")) return next();

  // B2: Mã hóa thành 12 ký tự bất kỳ
  this.password = await bcrypt.hash(this.password, 12);

  // B3: Xóa passwordConfirm khỏi DB
  this.passwordConfirm = undefined;

  next();
});

// 5. Hàm loại những ng dùng bị xóa ra khỏi CSDL
userSchema.pre(/^find/, function (next) {
  // this ở đây trỏ tới truy vấn hiện tại
  this.find({ active: { $ne: false } });
  next();
});

// 3.Hàm so sánh mkhau ng dùng đăng nhập
// vs mkhau có trong CSDL
// (ta sẽ hash mkhau đăng nhập và ktra nó vs mkhau CSDL)

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// 4. Hàm ktra xem nga dùng đã thay đổi mkhau chưa

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // (nếu thuộc tính passwordChangedAt tồn tại thì có nghĩa là
  // ng dùng đã thay đổi mkhau)
  // (JWTTimestamp: thời gian token đc tạo ra)
  return false;
  //(người dùng đã ko thay đổi password khi mã tbao đc phát hành)
};

userSchema.methods.createPasswordResetToken = function () {
  // Tạo 1 mã token ngẫu nhiên
  const resetToken = crypto.randomBytes(32).toString("hex");
  // Mã hóa token này
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // (mã token chỉ tồn tại trong 10 phút)

  return resetToken;
};
// (Ta sẽ thêm 2 field trong userModel là passwordResetToken và passwordResetExpires)
const User = mongoose.model("User", userSchema);

module.exports = User;
