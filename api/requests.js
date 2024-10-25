const mongoose = require("mongoose");
const Request = require("../models/Request");
require("dotenv").config();

mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const requests = await Request.find();
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Server error while fetching requests" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};