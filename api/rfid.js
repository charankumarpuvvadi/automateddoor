const mongoose = require("mongoose");
let isConnected;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
};

const keySchema = new mongoose.Schema({
  code: String,
  owner: String,
});

const Key = mongoose.models.Key || mongoose.model("Key", keySchema);

module.exports = async (req, res) => {
  await connectDB();
  try {
    const rfids = await Key.find(); // Fetch all RFID entries
    res.status(200).json(rfids);
  } catch (error) {
    res.status(500).json({ message: "Error fetching RFID data." });
  }
};
