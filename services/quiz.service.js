const { Types } = require("mongoose");
const Question = require("../models/questionModel");
const QuizModel = require("../models/quizModel");
const Test = require("../models/testModel");
const { getBagOfWords, cosineSimilarity } = require("../utils/recommend");

exports.QuizService = {
  createQuiz: async function (data) {
    const quiz = await QuizModel.create(data);
    return quiz;
  },

  getAllQuizzes: async function (id) {
    const quizzes = await QuizModel.find({});
    return quizzes;
  },

  getQuizById: async function (id) {
    const quiz = await Question.aggregate()
      .match({
        quiz: new Types.ObjectId(id),
      })
      .lookup({
        from: "quizzes",
        localField: "quiz",
        foreignField: "_id",
        as: "quiz",
      })
      .limit(7);
    return quiz;
  },

  recommendQuizzes: async function (quizId) {
    // Get the bag-of-words vectors for the user's quizzes
    const currentQuizId = new Types.ObjectId(quizId);

    const QuizData = await QuizModel.find({ _id: { $ne: currentQuizId } });

    const userQuizzes = QuizData.filter(
      (item) => item._id !== currentQuizId
    ).map((item) =>
      getBagOfWords(item.title + " " + item.description + " " + item.tags[0])
    );

    // Get the bag-of-words vector for the current quiz
    const currentQuiz = await QuizModel.findById(String(currentQuizId));
    const currentVector = getBagOfWords(
      currentQuiz.title +
        " " +
        currentQuiz.description +
        " " +
        currentQuiz.tags[0]
    );

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
      recommendedQuizzes.push(quiz);
      // }
      if (recommendedQuizzes.length >= 5) {
        break;
      }
    }

    return recommendedQuizzes;
  },
};
