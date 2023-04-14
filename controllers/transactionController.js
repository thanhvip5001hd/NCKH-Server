const Test = require("../models/testModel");
const catchAsync = require("../utils/catchAsync");
const { TransactionService } = require("../services/transaction.service");

exports.createTransaction = catchAsync(async (req, res) => {
  const transaction = await TransactionService.createTransaction(req.body);
  res.status(201).json({
    status: "success",
    data: {
      transaction,
    },
  });
});
