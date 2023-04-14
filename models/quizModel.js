const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A quiz must have a title"],
  },
  tags: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    required: [true, "A test must belong to one user"],
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  img: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

// testSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "questions",
//   }).populate({
//     path: "set",
//     select: "name",
//   });
//   next();
// });

const QuizModel = mongoose.model("Quiz", quizSchema);
module.exports = QuizModel;
