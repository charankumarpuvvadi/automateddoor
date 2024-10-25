const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  code: String,
  owner: { type: String, default: "test" },
});

module.exports = mongoose.model("Request", requestSchema);
