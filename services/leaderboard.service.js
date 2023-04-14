const { Types } = require("mongoose");
const LeaderboardModel = require("../models/leaderboardModel");

exports.LeaderboardService = {
  getLearderboardByQuiz: async function (quizId) {
    const id = new Types.ObjectId(quizId);
    const leaderboard = await LeaderboardModel.aggregate()
      .match({ quiz: new Types.ObjectId(quizId) })
      .lookup({
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      })
      .lookup({
        from: "quizzes",
        localField: "quiz",
        foreignField: "_id",
        as: "quiz",
      })
      .project({
        quiz: {
          $first: "$quiz",
        },
        user: {
          $first: "$user",
        },
        maxScore: 1,
      })
      .sort({
        maxScore: -1,
      });
    return leaderboard;
  },

  updateLeaderboard: async function (data) {
    const user = new Types.ObjectId(data.user);
    const quiz = new Types.ObjectId(data.quiz);

    const leaderboard = await this.getLearderboardData(user, quiz);
    if (leaderboard) {
      data.maxScore = Math.max(data.recentScore, leaderboard.maxScore);
    } else {
      data.maxScore = data.recentScore;
    }

    const set = await LeaderboardModel.findOneAndUpdate({ user, quiz }, data, {
      new: true,
      upsert: true,
      // (trả về document mới nhất)
    });

    return set;
  },

  createLeaderboardData: async function (data) {
    const leaderboardData = await LeaderboardModel.create(data);
    return leaderboardData;
  },

  getLearderboardData: async function (user, quiz) {
    const leaderboard = await LeaderboardModel.findOne({ user, quiz });
    return leaderboard;
  },
};
