// api/accept.js

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Key = require("./models/Key"); // Adjust the path as needed
const Request = require("./models/Request"); // Adjust the path as needed
const Log = require("./models/Log"); // Adjust the path as needed

// POST /api/requests/accept
router.post("/", async (req, res) => {
  const { code } = req.body;


  
  try {
    // Find the request by its code
    const request = await Request.findOne({ code });

    if (request) {
      // Create a new entry in the 'data' collection using the request data
      const newData = new Key({
        code: request.code,
        owner: request.owner,
      });

      await newData.save(); // Save the new data in MongoDB

      // Remove the accepted request from the 'requests' collection (optional)
      await Request.deleteOne({ code });

      res.status(200).send({ message: "Request accepted and added to data collection" });
    } else {
      res.status(404).send({ message: "Request not found" });
    }
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
