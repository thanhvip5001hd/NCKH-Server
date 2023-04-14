const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userTestHistorySchema = new mongoose.Schema({
  testId: {
    type: Schema.Types.ObjectId,
  },
  score: {
    type: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  userAnswers: {
    type: Array,
  },

  finishedAt: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number,
  },
});

userTestHistorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id name",
  });

  next();
});

const UserTestHistory = mongoose.model(
  "UserTestHistory",
  userTestHistorySchema
);
module.exports = UserTestHistory;
