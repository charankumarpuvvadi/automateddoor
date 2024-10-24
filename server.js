const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
require("dotenv").config();

const url = process.env.mongoURL;

const mongoose = require("mongoose");
const mqtt = require("mqtt");

const mongoURI = url;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const keySchema = new mongoose.Schema({
  code: String,
  owner: String,
});

const logSchema = new mongoose.Schema({
  code: String,
  timestamp: { type: Date, default: Date.now },
  status: String,
});

const requestSchema = new mongoose.Schema({
  code: String,
  owner: { type: String, default: "test" },
});

const Key = mongoose.model("data", keySchema);
const Request = mongoose.model("Request", requestSchema);
const Log = mongoose.model("log", logSchema);

const mqttBrokerUrl = "mqtt://broker.emqx.io:1883";
const client = mqtt.connect(mqttBrokerUrl);

const hexcodeTopic = "charan/iot/code";
const responseTopic = "iot/response";

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  client.subscribe(hexcodeTopic, (err) => {
    if (!err) {
      console.log(`Subscribed to ${hexcodeTopic}`);
    } else {
      console.error("Subscription error:", err);
    }
  });
});

app.get("/api/requests", async (req, res) => {
  try {
    // Fetch all requests from the MongoDB collection
    const requests = await Request.find();

    // Return the requests to the client
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Server error while fetching requests" });
  }
});

app.post("/api/requests/reject", async (req, res) => {
  const { code } = req.body;

  try {
    // Optionally, delete the request or just do nothing if you prefer
    await Request.deleteOne({ code });

    res.status(200).send({ message: "Request rejected and removed" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/api/requests/accept", async (req, res) => {
  const { code } = req.body;

  try {
    // Find the request by its code
    const request = await Request.findOne({ code });

    if (request) {
      // Create a new entry in the 'datas' collection using the request data
      const newData = new Key({
        code: request.code,
        owner: request.owner,
      });

      await newData.save(); // Save the new data in MongoDB

      // Remove the accepted request from the 'requests' collection (optional)
      await Request.deleteOne({ code });

      res
        .status(200)
        .send({ message: "Request accepted and added to datas collection" });
    } else {
      res.status(404).send({ message: "Request not found" });
    }
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/api/rfid", async (req, res) => {
  try {
    // Fetch all requests from the MongoDB collection
    const rfids = await Key.find();

    // Return the requests to the client
    res.status(200).json(rfids);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Server error while fetching requests" });
  }
});

app.get("/api/log", async (req, res) => {
  try {
    const logs = await Log.find(); // Fetch all logs from the log collection
    res.json(logs); // Send logs as JSON response
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "An error occurred while fetching logs." });
  }
});

client.on("message", async (topic, message) => {
  if (topic === hexcodeTopic) {
    const code = message.toString();

    console.log(`Received hexCode: ${code}`);

    try {
      const key = await Key.findOne({ code });

      if (key) {
        console.log('Key found in the database. Publishing "accept".');
        const newLog = new Log({ code, status: "accepted" });
        newLog.save();
        client.publish(responseTopic, JSON.stringify("accept"));
      } else {
        console.log('Key not found in the database. Publishing "reject".');
        const newRequest = new Request({ code });
        const newLog = new Log({ code, status: "rejected" });
        newLog.save();
        await newRequest.save();
        console.log(
          `Hex code ${code} added to requests collection with owner 'test'.`
        );
        client.publish(responseTopic, JSON.stringify("reject"));
      }
    } catch (error) {
      console.error("Error querying the database:", error);
    }
  }
});

app.listen(4500, () => {
  console.log("running");
});
