const express = require("express");
const transactionController = require("../controllers/transactionController");

const transactionRouter = express.Router();

transactionRouter.route("/").post(transactionController.createTransaction);

// req.body
// {
//     "unit_amount": 1000,
//     "name": "GGG",
//     "user": "64080fe4a7afbbc02086c5cc"
// }
module.exports = { transactionRouter };
