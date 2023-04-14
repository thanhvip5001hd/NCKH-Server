const express = require("express");
const { answerHistoryRouter } = require("./answerHistory.routes");
const { cardRouter } = require("./card.routes");
const { friendRouter } = require("./friendInvitation.routes");
const { leaderboardRouter } = require("./leaderboard.routes");
const { questionRoutes } = require("./question.routes");
const { quizRouter } = require("./quiz.routes");
const { reviewRouter } = require("./review.routes");
const { reviewQuestionRouter } = require("./reviewQuestion.routes");
const { scheduleRouter } = require("./schedule.routes");
const { setRouter } = require("./set.routes");
const { testRouter } = require("./test.routes");
const { transactionRouter } = require("./transaction.routes");
const { userRouter } = require("./user.routes");
const { webhookRouter } = require("./webhook.routes");

const indexRoutes = express.Router();

indexRoutes.use("/cards", cardRouter);
indexRoutes.use("/users", userRouter);
indexRoutes.use("/reviews", reviewRouter);
indexRoutes.use("/sets", setRouter);
indexRoutes.use("/questions", questionRoutes);
indexRoutes.use("/test", testRouter);
indexRoutes.use("/quiz", quizRouter);
indexRoutes.use("/leaderboard", leaderboardRouter);
indexRoutes.use("/webhook", webhookRouter);
indexRoutes.use("/review-question", reviewQuestionRouter);

indexRoutes.use("/transaction", transactionRouter);

indexRoutes.use("/friend-invitation", friendRouter);

indexRoutes.use("/schedule", scheduleRouter);

indexRoutes.use("/answer-history", answerHistoryRouter);

module.exports = indexRoutes;
