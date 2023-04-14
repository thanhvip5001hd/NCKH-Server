const Card = require("../../models/cardModel");

const getStudiedCardHandler = async (id, socket) => {
  try {
    const cardStudiedList = await Card.find({ setId: id, isLearned: true });
    socket.emit("sendStudiedCardToClient", cardStudiedList);
  } catch (err) {
    console.log(err);
  }
};

module.exports = getStudiedCardHandler;
