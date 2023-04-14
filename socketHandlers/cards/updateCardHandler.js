const Card = require("../../models/cardModel");

const updateCardHandler = async (data, socket) => {
  try {
    const { cardDataUpdate, cardId, setId } = data;
    await Card.findByIdAndUpdate(cardId, cardDataUpdate);
    const cardList = await Card.find({ setId: setId });
    socket.to(setId).emit("sendCardToClient", cardList);
  } catch (err) {
    console.log(err);
  }
};

module.exports = updateCardHandler;
