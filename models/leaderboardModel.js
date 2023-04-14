const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  recentScore: {
    type: Number,
    required: true,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: "Quiz",
    required: true,
  },
  createdAt: { type: Date, default: Date.now() },
});

const LeaderboardModel = mongoose.model("Leaderboard", leaderboardSchema);
module.exports = LeaderboardModel;
