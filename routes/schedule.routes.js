const express = require("express");
const scheduleController = require("../controllers/scheduleController");
const userController = require("../controllers/userController");

const scheduleRouter = express.Router();

scheduleRouter.route("/").post(scheduleController.createSchedule);

scheduleRouter
  .route("/getScheduleOfUser/:userId")
  .get(scheduleController.getAllSchedule);

scheduleRouter
  .route("/update-user-streak/:userId")
  .patch(userController.updateLearningStreak);

scheduleRouter.route("/user-streak/:id").get(userController.getUser);

scheduleRouter
  .route("/:id")
  .get(scheduleController.getSchedule)
  .patch(scheduleController.updateSchedule)
  .delete(scheduleController.deleteSchedule);

module.exports = { scheduleRouter };
