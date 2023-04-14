const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "A question must have a question."],
  },
  type: {
    type: String,
    required: [true, "A question must have a type"],
  },
  options: {
    type: Array,
  },
  answer: {
    type: String,
    required: [true, "A question must have an answer"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  test: {
    type: Schema.Types.ObjectId,
    ref: "Test",
  },
  quiz: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
  },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
