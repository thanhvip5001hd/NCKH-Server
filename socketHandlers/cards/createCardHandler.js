const Card = require("../../models/cardModel");

const createCardHandler = async (data, socket) => {
  try {
    // create new Card
    const card = await Card.create(data.cardData);
    const cardList = await Card.find({ setId: card.setId });

    socket.to(card.setId.valueOf()).emit("sendCardToClient", cardList);
  } catch (err) {
    console.log(err);
  }
};

module.exports = createCardHandler;
