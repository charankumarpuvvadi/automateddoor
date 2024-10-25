const mqtt = require("mqtt");
const mongoose = require("mongoose");
const Key = require("./models/Key");
const Log = require("./models/Log");
const Request = require("./models/Request");

require("dotenv").config();

mongoose.connect(process.env.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mqttBrokerUrl = "mqtt://broker.emqx.io:1883";
const hexcodeTopic = "charan/iot/code";
const responseTopic = "iot/response";
const client = mqtt.connect(mqttBrokerUrl);

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

client.on("message", async (topic, message) => {
  if (topic === hexcodeTopic) {
    const code = message.toString();
    console.log(`Received hexCode: ${code}`);

    try {
      const key = await Key.findOne({ code });
      if (key) {
        console.log('Key found in the database. Publishing "accept".');
        await new Log({ code, status: "accepted" }).save();
        client.publish(responseTopic, JSON.stringify("accept"));
      } else {
        console.log('Key not found in the database. Publishing "reject".');
        await new Request({ code }).save();
        await new Log({ code, status: "rejected" }).save();
        client.publish(responseTopic, JSON.stringify("reject"));
      }
    } catch (error) {
      console.error("Error querying the database:", error);
    }
  }
});
