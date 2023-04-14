const { Types } = require("mongoose");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionReviewSchema = new mongoose.Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  reviewDate: {
    type: Date,
    required: true,
  },
  reviewTest: {
    type: Schema.Types.ObjectId,
    ref: "ReviewTest",
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  repetitions: {
    type: Number,
    default: 0,
  },
  interval: {
    type: Number,
    default: 1,
  },
  easiness: {
    type: Number,
    default: 2.5,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const QuestionReviewModel = mongoose.model(
  "QuestionReview",
  questionReviewSchema
);
module.exports = QuestionReviewModel;
