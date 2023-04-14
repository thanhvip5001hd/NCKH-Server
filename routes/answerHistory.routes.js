const answerHistoryController = require("../controllers/answerHistoryController");
const express = require("express");
const answerHistoryRouter = express.Router();

answerHistoryRouter
  .post("/", answerHistoryController.createAnswerHistory)
  .post("/get-result", answerHistoryController.getAnswerHistory);

module.exports = { answerHistoryRouter };
