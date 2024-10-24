const mongoose = require("mongoose");
const mqtt = require("mqtt");

// Load environment variables from .env
require("dotenv").config();

// MongoDB setup
const mongoURI = process.env.mongoURL;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define MongoDB Schemas and Models
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

// MQTT setup
const mqttBrokerUrl = "mqtt://broker.emqx.io:1883";
const client = mqtt.connect(mqttBrokerUrl);

const hexcodeTopic = "charan/iot/code";
const responseTopic = "iot/response";

// MQTT connection
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

// MQTT message handler
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

// API handler for Vercel (Serverless function)
module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const logs = await Log.find(); // Fetch all logs
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching logs." });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
