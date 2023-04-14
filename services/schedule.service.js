const Schedule = require("../models/scheduleModel");

exports.ScheduleService = {
  createSchedule: async function (data) {
    const newSchedule = await Schedule.create(data);
    return newSchedule;
  },

  getAllSchedule: async function (params) {
    const { userId } = params;
    const schedules = await Schedule.find({ createdBy: userId });
    return schedules;
  },

  getSchedule: async function (id) {
    const schedule = await Schedule.findById(id);
    return schedule;
  },

  updateSchedule: async function (id, data) {
    const schedule = await Schedule.findByIdAndUpdate(id, data, {
      new: true,
      // (để nó sẽ trả về document mới nhất)
      runValidators: true,
      // (có chạy trình validate)
    });
    return schedule;
  },

  deleteSchedule: async function (id) {
    console.log("id: ", id);
    const schedule = await Schedule.findByIdAndDelete(id);
    return schedule;
  },
};
