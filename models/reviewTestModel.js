const mongoose = require("mongoose");

const reviewTestSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  questions: [{ type: mongoose.Types.ObjectId }],
  done: {
    type: Boolean,
    default: false,
  },
  reviewDate: {
    type: Date,
    required: true,
  },
  set: {
    type: mongoose.Types.ObjectId,
    ref: "Set",
  },
});

const ReviewTestModel = mongoose.model("ReviewTest", reviewTestSchema);
module.exports = ReviewTestModel;
