const express = require("express");
const testController = require("../controllers/testController");

const testRouter = express.Router();

testRouter.route("/").post(testController.createTest);
testRouter.route("/").put(testController.test).get(testController.upload);

testRouter.route("/:id").get(testController.getTest);

module.exports = { testRouter };
