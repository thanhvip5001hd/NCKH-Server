const Card = require("../../models/cardModel");

const getNotStudiedCardHandler = async (id, socket) => {
  try {
    const cardNotStudiedList = await Card.find({ setId: id, isLearned: false });
    socket.emit("sendNotStudiedCardToClient", cardNotStudiedList);
  } catch (err) {
    console.log(err);
  }
};

module.exports = getNotStudiedCardHandler;
