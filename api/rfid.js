const mongoose = require("mongoose");
const Key = require("../models/Key");
require("dotenv").config();

mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const rfids = await Key.find();
      res.status(200).json(rfids);
    } catch (error) {
      console.error("Error fetching RFID data:", error);
      res.status(500).json({ message: "Server error while fetching RFID data" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
