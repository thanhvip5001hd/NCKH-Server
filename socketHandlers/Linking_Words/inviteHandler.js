const { Types } = require("mongoose");
const conversationsModel = require("../../models/conversationsModel");
const FriendInvitation = require("../../models/friendInvitationModel");
const severStore = require("../../severStore");

const inviteLinkingWordsHandler = async (socket, data) => {
  const io = severStore.getSocketServerInstance();
  try {
    const { roomId, userId } = data;
    const invitedUsers = [];

    const conversation = await conversationsModel.findOne({
      _id: roomId,
    });

    for (const user of conversation?.participants) {
      if (String(user) !== userId) {
        invitedUsers.push(user);
      }
    }

    if (invitedUsers && invitedUsers[0]) {
      let invitation = await FriendInvitation.create({
        senderId: userId,
        receiverId: invitedUsers[0],
      });

      invitation = await FriendInvitation.aggregate()
        .match({ _id: new Types.ObjectId(invitation._id) })
        .lookup({
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "senderId",
        });

      const activeConnections = severStore.getActiveConnections(
        String(invitedUsers[0])
      );

      const inviteStatus = {};

      if (activeConnections.length === 0) {
        inviteStatus.online = false;
      } else {
        inviteStatus.online = true;

        activeConnections.forEach((socketId) => {
          io.to(socketId).emit("receive-invite", invitation);
        });
      }
    }

    // return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
    //   messages: conversation.messages,
    //   participants: conversation.participants,
    // });
  } catch (err) {
    console.log(err);
  }
};

module.exports = inviteLinkingWordsHandler;
