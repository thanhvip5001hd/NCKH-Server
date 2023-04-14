const mongoose = require("mongoose");

const dotenv = require("dotenv");
const http = require("http");
// Xử lý uncaught exception

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

dotenv.config();

const app = require("./app");
const { registerSocketServer } = require("./socketServer");
const server = http.createServer(app);
// C. Kết nối vs Socket.io
registerSocketServer(server);

const DB = process.env.MONGO.replace("<PASSWORD>", process.env.MONGO_PASSWORD);
// const DB = "mongodb://localhost:27017/Quizlet";

// B. Kết nối vào Mongo Compass
mongoose.connect(DB).then(() => {
  console.log("DB connection successful!");
});

// D. START SERVER
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Xử lý các promise bị reject (từ chối)
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLER REJECTION! Shutting down...");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
