const express = require("express");
const router = express.Router();
const Log = require("./models/Log"); // assuming the Log schema is in models folder

router.get("/", async (req, res) => {
  try {
    const logs = await Log.find();
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Server error while fetching logs." });
  }
});

module.exports = router;
