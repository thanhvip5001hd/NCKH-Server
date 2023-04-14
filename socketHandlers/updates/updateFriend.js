const FriendInvitation = require("../../models/friendInvitationModel");
const User = require("../../models/userModel");
const serverStore = require("../../severStore");

const updateFriendPendingInvitations = async (userId) => {
  try {
    // 1. Tìm những lời mời đang chờ xử lý
    const pendingInvitations = await FriendInvitation.find({
      receiverId: userId,
    }).populate("senderId", "_id name email avatarUrl");

    // 2. Lấy danh sách ng dùng đang online
    const receiverList = serverStore.getActiveConnections(userId);

    // 3. Lấy đối tượng io để emit or listen event của socket.io
    const io = serverStore.getSocketServerInstance();

    // 4. Phát ra sự kiện friend-invitations
    receiverList.forEach((receiverSocketId) => {
      // io.to: chỉ có những ng có receiverSocketId ms dc
      //  phát sự kiện friend-invitations"

      io.to(receiverSocketId).emit("friend-invitations", {
        pendingInvitations: pendingInvitations ? pendingInvitations : [],
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const updateFriends = async (userId) => {
  try {
    // 1. Tìm các ng dùng đang onlines
    const receiverList = serverStore.getActiveConnections(userId);
    // console.log("receiverList", receiverList);
    if (receiverList.length > 0) {
      const user = await User.findById(userId, { _id: 1, friends: 1 }).populate(
        "friends",
        "_id name email avatarUrl"
      );

      // console.log("user", user);

      if (user) {
        const friendsList = user.friends.map((fr) => {
          return {
            id: fr._id,
            mail: fr.email,
            username: fr.name,
            avatarUrl: fr.avatarUrl,
          };
        });

        // console.log("friendsList", friendsList);

        // 2. get io server instance
        const io = serverStore.getSocketServerInstance();

        receiverList.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit("friends-lists", {
            friends: friendsList ? friendsList : [],
          });
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  updateFriendPendingInvitations,
  updateFriends,
};
