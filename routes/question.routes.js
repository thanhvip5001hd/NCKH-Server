const express = require("express");
const questionController = require("../controllers/questionController");

const questionRoutes = express.Router();

questionRoutes.post(questionController.createQuestion);

questionRoutes.route("/:questionId").get(questionController.getQuestionById);

module.exports = { questionRoutes };
