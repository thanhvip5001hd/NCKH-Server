const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAnswerHistorySchema = new mongoose.Schema({
  testId: {
    type: Schema.Types.ObjectId,
    ref: "Test",
  },
  answers: {
    type: Array,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const UserAnswerHistory = mongoose.model(
  "UserAnswerHistory",
  userAnswerHistorySchema
);
module.exports = UserAnswerHistory;
