const serverStore = require("../severStore");
const friendUpdate = require("../socketHandlers/updates/updateFriend");
const chatUpdate = require("./updates/updateChatRoom");

const newConnectionHandler = async (socket, userDetails) => {
  serverStore.addNewConnectedUser({
    // socket.id: id của lượt kết nốt của ng dùng
    socketId: socket.id,
    userId: userDetails.id,
  });

  // 1. Để khi reset lời mời ko mất thì ta mỗi lần kết nối ta
  // phải update danh sách Invitation
  friendUpdate.updateFriendPendingInvitations(userDetails.id);

  // 2. Update friends list
  friendUpdate.updateFriends(userDetails.id);

  // 3. Update rooms list
  chatUpdate.updateChatRoom(userDetails.id);

  // 4. Update video room list
  // setTimeout(() => {
  //   videoUpdate.updateRooms(socket.id);
  // }, [500]);
};

module.exports = newConnectionHandler;
