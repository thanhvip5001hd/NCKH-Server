const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: { type: String },
  date: { type: Date, default: Date.now() },
  type: { type: String },
  turn: { type: Number },
});

module.exports = mongoose.model("Message", messageSchema);
