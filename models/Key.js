const mongoose = require("mongoose");

const keySchema = new mongoose.Schema({
  code: String,
  owner: String,
});

module.exports = mongoose.model("data", keySchema);
