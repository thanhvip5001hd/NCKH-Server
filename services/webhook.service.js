const { Types } = require("mongoose");
const Set = require("../models/setModel");
const severStore = require("../severStore");
const { ReviewService } = require("./review.service");

exports.WebhookService = {
  emitReviewTestId: async function (id) {
    const reviewSet = await ReviewService.getReviewTestById(id);

    const io = severStore.getSocketServerInstance();
    io.emit("notify-review", reviewSet);

    return reviewSet;
  },
};
