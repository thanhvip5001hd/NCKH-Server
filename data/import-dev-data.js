const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Class = require("../models/classModel");

dotenv.config();

const DB = process.env.MONGO.replace("<PASSWORD>", process.env.MONGO_PASSWORD);

// A. Kết nối vào Mongo Compass
mongoose.connect(DB).then(() => {
  console.log("DB connection successful!");
});

// B. READ JSON FILE
const classroom = JSON.parse(
  fs.readFileSync(`${__dirname}/class.json`, "utf-8")
);

// C. IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Class.create(classroom);
    console.log("Data successfully loaded!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// D. Xóa tất cả dữ liệu đang có trg DB
const deleteData = async () => {
  try {
    await Class.deleteMany();
    console.log("Data successfully deleted!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// E. Khởi động hàm

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
