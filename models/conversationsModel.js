const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  score: {
    type: Object,
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);
