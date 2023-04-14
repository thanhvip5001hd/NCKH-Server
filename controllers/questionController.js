const catchAsync = require("../utils/catchAsync");
const { QuestionService } = require("../services/question.service");

exports.createQuestion = catchAsync(async (req, res) => {
  const newQuestionList = await QuestionService.createQuestion(req.body);

  res.status(201).json({
    status: "success",
    data: {
      questions: newQuestionList,
    },
  });
});

exports.getQuestionById = catchAsync(async (req, res) => {
  const question = await QuestionService.getQuestionById(req.params.questionId);

  res.status(201).json({
    status: "success",
    data: {
      question,
    },
  });
});
