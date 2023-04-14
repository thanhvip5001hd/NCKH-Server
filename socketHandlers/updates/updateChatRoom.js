const User = require("../../models/userModel");
const serverStore = require("../../severStore");
const Conversation = require("../../models/conversationsModel");
const { Types } = require("mongoose");

const updateChatRoom = async (userId) => {
  // 1. Tìm các người dùng đang onlines
  const receiverList = serverStore.getActiveConnections(userId);
  if (receiverList.length > 0) {
    const user = await User.findById(userId, { _id: 1, rooms: 1 }).populate(
      "rooms",
      "_id participants"
    );

    console.log(userId);
    const roomsList = await Conversation.aggregate()
      .match({
        participants: new Types.ObjectId(userId),
      })
      .lookup({
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
      })
      .sort({
        createdAt: -1,
      })
      .group({
        _id: "$participants",
        latestCreatedAt: { $max: "$createdAt" },
        latestDocument: { $first: "$$ROOT" },
      })
      .sort({
        latestCreatedAt: -1,
      })
      .group({
        _id: null,
        documents: { $push: "$latestDocument" },
      })
      .project({
        _id: 0,
        documents: 1,
      });

    // if (user) {
    //   let roomsList = user.rooms.map(async (r) => {
    //     const conversation = await Conversation.findById(r._id).populate(
    //       "participants",
    //       "_id name email avatarUrl"
    //     );

    //     return conversation;
    //   });

    //   roomsList = await Promise.all(roomsList);
    //   console.log("roomsList: ", roomsList);

    // 2. get io server instance
    const io = serverStore.getSocketServerInstance();

    // 3. Gửi List room tới các ng dùng
    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit("rooms-lists", {
        rooms: roomsList[0]?.documents ? roomsList[0]?.documents : [],
      });
    });
    // }
  }
};

module.exports = {
  updateChatRoom,
};
