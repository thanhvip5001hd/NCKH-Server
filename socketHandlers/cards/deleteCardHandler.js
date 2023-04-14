const Card = require("../../models/cardModel");

const deleteCardHandler = async (data, socket) => {
  try {
    const { cardId, setId } = data;
    console.log("setId", setId);
    await Card.findByIdAndDelete(cardId);
    const cardList = await Card.find({ setId: setId });

    socket.to(setId).emit("sendCardToClient", cardList);
  } catch (err) {
    console.log(err);
  }
};

module.exports = deleteCardHandler;
