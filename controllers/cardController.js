const mongoose = require("mongoose");

const Card = require("../models/cardModel");
const { CardService } = require("../services/card.service");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllCards = catchAsync(async (req, res) => {
  const cards = await CardService.getAllCards(req.query.name);
  res.status(200).json({
    status: "success",
    results: cards.length,
    data: {
      cards,
    },
  });
});

exports.getCard = catchAsync(async (req, res) => {
  const card = await CardService.getCardById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      card,
    },
  });
});

exports.createCard = catchAsync(async (req, res) => {
  const newCard = await CardService.createCard(req, res);
  res.status(201).json({
    status: "success",
    data: {
      cards: newCard,
    },
  });
});

exports.updateCard = catchAsync(async (req, res) => {
  const card = await CardService.updateCard(req.params.id, req.body);
  res.status(201).json({
    status: "success",
    data: {
      card,
    },
  });
});

exports.deleteCard = catchAsync(async (req, res) => {
  const card = CardService.deleteCardById(req.params.id);
  res.status(204).json({
    status: "success",
    data: {
      card,
    },
  });
});

exports.getCardsBySet = catchAsync(async (req, res, next) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.setId);
  if (!isValidId) {
    return next(new AppError("Invalid setID.", 404));
  }
  const cardList = await CardService.getCardsBySet(req.setId);

  res.status(200).json({
    status: "success",
    results: cardList.length,
    data: {
      cardList,
    },
  });
});
