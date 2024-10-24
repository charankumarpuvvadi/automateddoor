const express = require("express");
const router = express.Router();
const Request = require("./models/Request");

router.get("/", async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Server error while fetching requests." });
  }
});

router.post("/accept", async (req, res) => {
  const { code } = req.body;

  try {
    const request = await Request.findOne({ code });
    if (request) {
      const Key = require("./models/Key");
      const newData = new Key({ code: request.code, owner: request.owner });
      await newData.save();
      await Request.deleteOne({ code });
      res.status(200).json({ message: "Request accepted" });
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
