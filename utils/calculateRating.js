const Question = require("../models/questionModel");

async function calculateRating(question) {
  const originalQuestion = await Question.findById(String(question.question));
  let rating = 5;
  if (originalQuestion.answer !== question.answer) {
    rating = rating - 3;
  }
  if (question.time > 7) {
    rating--;
  }
  if (question.time > 14) {
    rating--;
  }

  if (rating < 0) {
    rating = 0;
  }

  return rating;
}

module.exports = calculateRating;
