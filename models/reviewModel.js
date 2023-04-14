const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review can not be empty"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user"],
  },
});

// Querry middleware: chạy mỗi trc khi mỗi truy vấn
// find dc chạy
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name avatarUrl",
  });
  next();
  // => điền thông tin user vào các id user chứa
  // trong reviews
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
