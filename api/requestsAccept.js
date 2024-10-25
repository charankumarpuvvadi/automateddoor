const mongoose = require("mongoose");
const Request = require("../models/Request");
const Key = require("../models/Key");
require("dotenv").config();

mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  if (req.method === "POST") {
    const { code } = req.body;
    try {
      const request = await Request.findOne({ code });
      if (request) {
        const newData = new Key({ code: request.code, owner: request.owner });
        await newData.save();
        await Request.deleteOne({ code });
        res.status(200).json({ message: "Request accepted and added to data collection" });
      } else {
        res.status(404).json({ message: "Request not found" });
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
