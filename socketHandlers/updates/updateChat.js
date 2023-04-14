const { Types } = require("mongoose");
const Conversation = require("../../models/conversationsModel");
const severStore = require("../../severStore");

// Lưu lại lịch sử các tin nhắn cũ
const updateChatHistory = async (
  participants,
  toSpecifiedSocketId = null
  // => Để chỉ gửi lịch sử tin nhắn tới ng dùng dùng cụ thể
) => {
  // participants = participants
  //   ? participants
  //   : ["6415bc9ca508014d9c06e30c", "6415bc9ca508014d9c06e30c"];
  console.log("participants: ", participants);
  const conversations = await Conversation.aggregate()
    .match({
      $and: [
        {
          participants: {
            $all: [
              {
                $elemMatch: {
                  $eq: new Types.ObjectId(participants[0]),
                },
              },
              {
                $elemMatch: {
                  $eq: new Types.ObjectId(participants[1]),
                },
              },
            ],
          },
        },
      ],
    })
    .lookup({
      from: "messages",
      localField: "messages",
      foreignField: "_id",
      as: "messages",
    })
    .lookup({
      from: "users",
      localField: "participants",
      foreignField: "_id",
      as: "participants",
    })
    .unwind({
      path: "$messages",
    })
    .lookup({
      from: "users",
      localField: "messages.author",
      foreignField: "_id",
      as: "messages.author",
    })
    .unwind({
      path: "$messages.author",
    })
    .group({
      _id: "$_id",
      messages: {
        $push: "$messages",
      },
      participants: {
        $first: "$participants",
      },
      createdAt: {
        $first: "$createdAt",
      },
    })
    .sort({
      createdAt: 1,
    });
  console.log("conversations: ", conversations);

  const io = severStore.getSocketServerInstance();

  const lastestDocuments = await Conversation.aggregate()
    .match({
      $and: [
        {
          participants: {
            $all: [
              {
                $elemMatch: {
                  $eq: new Types.ObjectId(participants[0]),
                },
              },
              {
                $elemMatch: {
                  $eq: new Types.ObjectId(participants[1]),
                },
              },
            ],
          },
        },
      ],
    })
    .lookup({
      from: "messages",
      localField: "messages",
      foreignField: "_id",
      as: "messages",
    })
    .lookup({
      from: "users",
      localField: "participants",
      foreignField: "_id",
      as: "participants",
    });

  // 1. Gửi lịch sử tin nhắn đến 1 ng dùng đc chỉ định
  // (trg trường hợp 1 ng dùng bất kỳ yêu cầu xem lịch sử trò chuyện)
  if (toSpecifiedSocketId) {
    // (phát sự kiện xem lại lịch sử tin nhắn)
    return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
      participants: conversations[0]?.participants,
      conversations:
        conversations.length !== 0 ? conversations : lastestDocuments,
    });
  }

  // Kiểm tra xem ng dùng của conversations có đg online k
  // (Nếu có gửi họ lịch sử tin nhắn)

  conversations[0]?.participants.forEach((userId) => {
    const activeConnections = severStore.getActiveConnections(
      String(userId._id)
    );

    activeConnections.forEach((socketId) => {
      io.to(socketId).emit("direct-chat-history", {
        participants: conversations[0]?.participants,
        conversations:
          conversations.length !== 0 ? conversations : lastestDocuments,
      });
    });
  });
};

module.exports = { updateChatHistory };
