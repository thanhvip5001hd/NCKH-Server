const { Types } = require("mongoose");
const ReviewTestBullQueue = require("../bull/queue");
const Question = require("../models/questionModel");
const QuestionReviewModel = require("../models/questionReviewModel");
const ReviewTestModel = require("../models/reviewTestModel");
const Test = require("../models/testModel");
const calculateRating = require("../utils/calculateRating");
const calculateSM_2 = require("../utils/sm-2");
const { LeaderboardService } = require("./leaderboard.service");
const { UserService } = require("./user.service");

const reviewTestQueue = new ReviewTestBullQueue();

exports.ReviewService = {
  getReviewTestById: async function (id) {
    const reviewSet = await ReviewTestModel.aggregate()
      .match({ _id: new Types.ObjectId(id) })
      .lookup({
        from: "questionreviews",
        localField: "questions",
        foreignField: "_id",
        as: "questions",
      })
      .lookup({
        from: "questions",
        localField: "questions.question",
        foreignField: "_id",
        as: "questionInfo",
      });
    return reviewSet;
  },

  createReviewTest: async function (data) {
    const reviewSet = await ReviewTestModel.create(data);

    // Add delay Job data vao Queue de nhac nho ng dung khi den gio review
    const reviewTestJob = await reviewTestQueue.addReviewQueue({
      id: reviewSet._id,
      time: reviewSet.reviewDate,
    });

    return reviewSet;
  },

  createReviewQuestions: async function (data) {
    const reviewTests = {};
    const reviewQuestions = [];
    const userId = new Types.ObjectId(data[0].user);

    await UserService.updateLearningStreak(String(userId));

    let setId;
    let quizId;

    const questionInfo = await Question.findById(String(data[0].question));
    if (questionInfo.test) {
      const test = await Test.findById(String(questionInfo.test));
      setId = test.set;
    } else if (questionInfo.quiz) {
      quizId = questionInfo.quiz;
    }

    const deletedReviewSet = await ReviewTestModel.deleteMany({ set: setId });
    const deletedReviewQuiz = await ReviewTestModel.deleteMany({ set: quizId });

    let score = 0;

    for (const question of data) {
      question.rating = await calculateRating(question);
      if (question.rating >= 3) {
        score++;
      }

      const processedQuestion = calculateSM_2(question);
      const reviewDate =
        processedQuestion.reviewDate.toLocaleDateString("pt-PT");

      if (reviewTests[reviewDate]) {
        reviewTests[reviewDate].push(question);
      } else {
        reviewTests[reviewDate] = [];
        reviewTests[reviewDate].push(question);
      }
    }

    for (const date in reviewTests) {
      // const reviewTestId = new Types.ObjectId();
      const reviewTestQuestions = [];
      const reviewTestDate = reviewTests[date][0].reviewDate;

      for (const question of reviewTests[date]) {
        const questionReview = await QuestionReviewModel.findOneAndUpdate(
          { user: question.user, question: question.question },
          question,
          { upsert: true, new: true }
        );
        reviewTestQuestions.push(questionReview._id);
      }

      const set = setId ? setId : quizId;

      const reviewTest = await this.createReviewTest({
        name: `${date}`,
        user: userId,
        questions: reviewTestQuestions,
        reviewDate: reviewTestDate,
        set,
      });
    }

    await LeaderboardService.updateLeaderboard({
      recentScore: score,
      user: userId,
      quiz: quizId ? quizId : "640814263540faff47c65d06",
    });

    return { score: `${score} /${data.length}` };
  },

  getTodayReviewTests: async function () {
    const reviewReviewTest = await ReviewTestModel.find({
      // name: new Date().toLocaleDateString("pt-PT"),
      done: false,
    });
    return reviewReviewTest;
  },

  markReviewTestDone: async function (id) {
    const reviewReviewTest = await ReviewTestModel.findByIdAndUpdate(
      id,
      {
        done: true,
      },
      { new: true }
    );

    await reviewTestQueue.deleteJobById(reviewReviewTest._id);

    return reviewReviewTest;
  },
};

const test = [
  { question: Types.ObjectId(), rating: 4, user: Types.ObjectId() },
  { question: Types.ObjectId(), rating: 3, user: Types.ObjectId() },
];
