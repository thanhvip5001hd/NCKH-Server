const express = require("express");
const cardController = require("../controllers/cardController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const cardRouter = express.Router({ mergeParams: true });

cardRouter.route("/getAllCard").get(cardController.getCardsBySet);

cardRouter
  .route("/")
  .get(cardController.getAllCards)
  .post(upload.single("filename"), cardController.createCard);

cardRouter
  .route("/:id")
  .get(cardController.getCard)
  .patch(cardController.updateCard)
  .delete(cardController.deleteCard);

module.exports = { cardRouter };
