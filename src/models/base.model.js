const mongoose = require("mongoose");

const baseModelSchema = new mongoose.Schema({
  isDeleted: { type: Boolean, default: false },
});

module.exports = baseModelSchema;
