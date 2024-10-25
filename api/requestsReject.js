const mongoose = require("mongoose");
const Request = require("../models/Request");
require("dotenv").config();

mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  if (req.method === "POST") {
    const { code } = req.body;
    try {
      await Request.deleteOne({ code });
      res.status(200).json({ message: "Request rejected and removed" });
    } catch (error) {
      console.error("Error rejecting request:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
