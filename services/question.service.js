const Question = require("../models/questionModel");
const Test = require("../models/testModel");

exports.QuestionService = {
  createQuestion: async function (data) {
    const { questionMulty, testId, type, questionEssay } = data;

    let newQuestionList;
    if (type === "essay") {
      newQuestionList = await Question.insertMany({
        ...questionEssay,
        test: testId,
      });
    }

    if (type === "multiple-choice") {
      newQuestionList = await Question.insertMany({
        ...questionMulty,
        test: testId,
      });
    }

    const test = await Test.findById(testId);
    test.questions = newQuestionList.map((q) => {
      return q._id;
    });
    console.log(test);
    await test.save();
    return newQuestionList;
  },

  getQuestionById: async function (id) {
    const question = await Question.findById(id);

    return question;
  },
};
