const { v4: uuidv4 } = require("uuid");

const connectedUsers = new Map();
let activeRooms = [];

let io = null;

const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};

const getSocketServerInstance = () => {
  return io;
};

// Đối tượng Map() giữ các cặp khóa-giá trị và
// ghi nhớ thứ tự chèn ban đầu của các khóa.
const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUsers.set(socketId, { userId });
  // Mỗi khi ng dùng nào connect thì sẽ đc lưu thông tin vào
  // connectedUsers
  console.log("new connected users");
  console.log(connectedUsers);

  // Map(1) {
  //   'DJ_AI55l3gac6myvAAAB' => { userId: '6339b2100628b591e10ff32a' }
  // }
};

// Lấy tất cả các ng dùng đang online
const getActiveConnections = (userId) => {
  const activeConnections = [];

  connectedUsers.forEach(function (value, key) {
    // key: id của ng dùng đg online
    // '8XfelQMP_blQn7FeAAAF' => { userId: '632fc9502b39d6c433483c56' },
    // (value.userId là cái userId)
    if (value.userId === userId) {
      activeConnections.push(key);
    }
  });

  return activeConnections;
};

const getOnlineUsers = () => {
  const onlineUsers = [];

  connectedUsers.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });

  return onlineUsers;
};
const removeConnectedUser = (socketId) => {
  // Xóa ng dùng khỏi Map khi ng dùng mất kết nối
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
    console.log("new connected users");
    console.log(connectedUsers);
  }
};

module.exports = {
  getSocketServerInstance,
  setSocketServerInstance,
  addNewConnectedUser,
  getActiveConnections,
  getOnlineUsers,
  removeConnectedUser,
};
