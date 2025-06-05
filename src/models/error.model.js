const mongoose = require("mongoose");
const baseModelSchema = require("./base.model");

const DOCUMENT_NAME = "Error";
const COLLECTION_NAME = "Errors";

const errorSchema = mongoose.Schema(
  {
    code: { type: String, required: true },
    message: { type: String, required: true },
    file: { type: String, required: true },
    function: { type: String, required: true },
    stackTrace: { type: String, required: true },
    ...baseModelSchema.obj,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, errorSchema);
