const Set = require("../models/setModel");
const UserTestHistory = require("../models/userTestHistoryModel");

exports.AnswerHistoryService = {
  createAnswerHistory: async function (data) {
    const newTestHistory = await UserTestHistory.create(data);
    return newTestHistory;
  },

  getAnswerHistory: async function (data) {
    const { testId } = data;
    const testHistory = await UserTestHistory.findOne({ testId });

    if (!testHistory) {
      return next(new AppError("No history found with that ID", 404));
    }
    return testHistory;
  },
};
