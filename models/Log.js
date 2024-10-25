const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  code: String,
  timestamp: { type: Date, default: Date.now },
  status: String,
});

module.exports = mongoose.model("Log", logSchema);
