const { Types } = require("mongoose");
const QuizModel = require("../models/quizModel");
const Test = require("../models/testModel");
const { getBagOfWords, cosineSimilarity } = require("../utils/recommend");

exports.TestService = {
  createTest: async function (data) {
    const newTests = await Test.create(data);
    return newTests;
  },

  getTest: async function (id) {
    const test = await Test.findById(id);
    return test;
  },

  test: async function () {
    // Get the bag-of-words vectors for the user's quizzes
    const currentQuizId = new Types.ObjectId("640837a445fc9c15f561510f");

    const QuizData = await QuizModel.find({ _id: { $ne: currentQuizId } });

    const userQuizzes = QuizData.filter(
      (item) => item._id !== currentQuizId
    ).map((item) => getBagOfWords(item.title));

    // Get the bag-of-words vector for the current quiz
    const currentQuiz = await QuizModel.findById(String(currentQuizId));
    const currentVector = getBagOfWords(currentQuiz.title);

    // Calculate the similarity between the current quiz and the user's quizzes
    const similarities = {};
    for (let i = 0; i < userQuizzes.length; i++) {
      const similarity = cosineSimilarity(currentVector, userQuizzes[i]);
      similarities[i] = similarity;
    }

    // Sort the user quizzes by similarity score
    const similarQuizzes = Object.keys(similarities).sort(
      (a, b) => similarities[b] - similarities[a]
    );

    // Get the quizzes that the similar quizzes are based on
    const recommendedQuizzes = [];
    for (const quizIndex of similarQuizzes) {
      const quiz = QuizData[quizIndex];
      // if (
      //   quiz._id !== currentQuizId &&
      //   !recommendedQuizzes.includes(quiz._id)
      // ) {
      recommendedQuizzes.push(quiz.title);
      // }
      if (recommendedQuizzes.length >= 5) {
        break;
      }
    }

    return recommendedQuizzes;
  },
};
