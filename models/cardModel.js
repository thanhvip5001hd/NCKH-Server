const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  word: {
    type: String,
    required: [true, "A card must have a word."],
  },
  meaningUsers: {
    type: String,
    required: [true, "A card must have a definition."],
  },
  meanings: [
    {
      partOfSpeech: {
        type: String,
      },
      definitions: [
        {
          definition: String,
          example: String,
          synonyms: [String],
          antonyms: [String],
        },
      ],
    },
  ],
  synonyms: [String],
  antonyms: [String],
  fileUrl: String,
  mimeType: String,
  pronounce: String,
  createdAt: { type: Date, default: Date.now() },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  slug: String,
  audio: String,
  setId: {
    type: mongoose.Schema.ObjectId,
    ref: "Set",
  },
  isLearned: {
    type: Boolean,
    default: false,
  },
});

// Populate cho tất cả các query dùng find
cardSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "_id name email avatarUrl",
  });

  next();
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
