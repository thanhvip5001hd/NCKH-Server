const calculateSM_2 = (question) => {
  if (question.rating < 0 || question.rating > 5) {
    question.rating = 3;
  }

  // retrieve the stored values (default values if new cards)
  question.repetitions = question.repetitions ? question.repetitions : 0;
  question.easiness = question.easiness ? question.easiness : 2.5;
  question.interval = question.interval ? question.interval : 1;

  // easiness factor
  question.easiness = Math.max(
    1.3,
    question.easiness +
      0.1 -
      (5.0 - question.rating) * (0.08 + (5.0 - question.rating) * 0.02)
  );

  // repetitions
  if (question.rating < 3) {
    question.repetitions = 0;
  } else {
    question.repetitions += 1;
  }

  // interval
  if (question.repetitions <= 1) {
    question.interval = 1;
  } else if (question.repetitions == 2) {
    question.interval = 6;
  } else {
    question.interval = Math.round(question.interval * question.easiness);
  }

  // next practice
  const millisecondsInDay = 60 * 60 * 24 * 1000;
  const now = Date.now();
  question.reviewDate = new Date(now + millisecondsInDay * question.interval);

  return question;
};

module.exports = calculateSM_2;
