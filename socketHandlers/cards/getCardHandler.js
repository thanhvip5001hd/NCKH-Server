const Card = require("../../models/cardModel");

const getCardHandler = async (id, socket) => {
  try {
    const cardList = await Card.find({ setId: id });
    socket.emit("getCardInClient", cardList);
  } catch (err) {
    console.log(err);
  }
};

module.exports = getCardHandler;
