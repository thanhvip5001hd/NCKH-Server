const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A set must have a name."],
  },
  description: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now() },
  numCards: Number,
  image: String,
  slug: String,
  cardsList: {
    type: mongoose.Schema.ObjectId,
    ref: "Card",
  },
});

// Populate cho tất cả các query dùng find
setSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "_id name email avatarUrl",
  });

  next();
});
const Set = mongoose.model("Set", setSchema);
module.exports = Set;
