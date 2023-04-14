const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A schedule must have a title."],
  },
  description: {
    type: String,
    required: [true, "A schedule must have a description"],
  },
  label: {
    type: String,
  },
  day: {
    type: Date,
    default: Date.now(),
  },
  id: {
    type: String,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
});

scheduleSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "name avatarUrl",
  });
  next();
});
const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
