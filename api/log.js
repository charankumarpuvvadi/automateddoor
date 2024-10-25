const mongoose = require("mongoose");
const Log = require("../models/Log");
require("dotenv").config();

mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const logs = await Log.find();
      res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ message: "Server error while fetching logs" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
