const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");

const DOCUMENT_NAME = "InputDetail";
const COLLECTION_NAME = "InputDetails";

var inputDetailSchema = new mongoose.Schema(
  {
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },
    inputId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Input",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    requestQuantity: {
      type: Number,
      min: 0,
    },
    actualQuantity: {
      type: Number,
      min: 0,
    },
    inputPrice: {
      type: Number,
      min: 0,
    },
    suggestedOutputPrice: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Done","Cancelled"],
      default: "Pending",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ...baseModelSchema.obj,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, inputDetailSchema);
