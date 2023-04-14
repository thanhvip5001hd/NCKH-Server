const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "A test must have a type"],
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    required: [true, "A test must belong to one user"],
    ref: "User",
  },
  set: {
    type: Schema.Types.ObjectId,
    // required: [true, "A test must belong to a set"],
    ref: "Set",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

testSchema.pre(/^find/, function (next) {
  this.populate({
    path: "questions",
  }).populate({
    path: "set",
    select: "name",
  });
  next();
});

const Test = mongoose.model("Test", testSchema);
module.exports = Test;
