const serverStore = require("../severStore");

const disconnectHandler = (socket) => {
  serverStore.removeConnectedUser(socket.id);
};
module.exports = disconnectHandler;
