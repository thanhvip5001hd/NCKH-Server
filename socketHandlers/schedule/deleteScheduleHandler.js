const Schedule = require("../../models/scheduleModel");

const deleteScheduleHandler = async (socket, data) => {
  try {
    const { userId, ...scheduleData } = data;
    console.log("scheduleData: ", scheduleData);
    const schedule = await Schedule.findByIdAndDelete(
      scheduleData.selectedEventId
    );

    const scheduleOfUser = await Schedule.find({
      createdBy: schedule.createdBy,
    });

    socket.to(userId).emit("sendScheduleToClient", scheduleOfUser);
  } catch (err) {
    console.log(err);
  }
};

module.exports = deleteScheduleHandler;
