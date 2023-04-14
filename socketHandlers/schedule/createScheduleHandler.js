const Schedule = require("../../models/scheduleModel");

const createScheduleHandler = async (socket, data) => {
  try {
    const { userId, ...scheduleData } = data;
    console.log("scheduleData: ", scheduleData);

    const schedule = await Schedule.create(scheduleData);

    const scheduleOfUser = await Schedule.find({
      createdBy: schedule.createdBy,
    });

    socket.to(userId).emit("sendScheduleToClient", scheduleOfUser);
  } catch (err) {
    console.log(err);
  }
};

module.exports = createScheduleHandler;
