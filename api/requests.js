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

const requestSchema = new mongoose.Schema({
  code: String,
  owner: { type: String, default: "test" },
});

const Request = mongoose.models.Request || mongoose.model("Request", requestSchema);

module.exports = async (req, res) => {
  await connectDB();
  const { method } = req;

  if (method === 'GET') {
    try {
      const requests = await Request.find();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching requests." });
    }
  } else if (method === 'POST') {
    const { action, code } = req.body;

    if (action === "accept") {
      try {
        const request = await Request.findOne({ code });
        if (request) {
          await request.remove(); // Remove the accepted request
          res.status(200).json({ message: "Request accepted." });
        } else {
          res.status(404).json({ message: "Request not found." });
        }
      } catch (error) {
        res.status(500).json({ message: "Error accepting request." });
      }
    } else if (action === "reject") {
      try {
        await Request.deleteOne({ code });
        res.status(200).json({ message: "Request rejected and removed." });
      } catch (error) {
        res.status(500).json({ message: "Error rejecting request." });
      }
    } else {
      res.status(400).json({ message: "Invalid action." });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed." });
  }
};
