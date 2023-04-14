const { Types } = require("mongoose");
const Card = require("../models/cardModel");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);

const storage = getStorage();

exports.CardService = {
  getAllCards: async function (name) {
    let query = name;
    if (!query) {
      query = {};
    }
    const cards = await Card.find(query);
    return cards;
  },

  getCardById: async function (id) {
    const card = await Card.findOne({ _id: new Types.ObjectId(id) });
    return card;
  },

  createCard: async function (req, res) {
    const now = new Date().getMinutes();
    const mimeType = req.file.mimetype.split("/")[0];
    console.log(mimeType);

    const storageRef = ref(
      storage,
      `files/${req.file.originalname + " - " + now}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");

    const data = req.body;
    data.setId = new Types.ObjectId(data.setId);
    data.mimeType = mimeType;
    data.fileUrl = downloadURL;
    const newCard = await Card.create({
      ...data,
      meanings: JSON.parse(data?.meanings[0]),
    });
    return newCard;
  },

  updateCard: async function (id, data) {
    const card = await Card.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      data
    );
    return card;
  },

  deleteCardById: async function (id) {
    const card = await Card.findByIdAndDelete(id);
    return card;
  },

  getCardsBySet: async function (id) {
    const cards = await Card.find({ setId: id });
    return cards;
  },
};
