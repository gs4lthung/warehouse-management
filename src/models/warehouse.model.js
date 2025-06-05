const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");
const stockCheckModel = require("./stockCheck.model");
const outputModel = require("./output.model");
const warehouseCheckModel = require("./warehouseCheck.model");
const inputModel = require("./input.model");
const stockTransactionModel = require("./stockTransaction.model");
const warehouseStorageModel = require("./warehouseStorage.model");

const DOCUMENT_NAME = "Warehouse";
const COLLECTION_NAME = "Warehouses";

var warehouseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            enum: ["Cold", "Normal", "Disposal", "Other"],
            default: "Normal",
        },
        minTemperature: {
            type: Number,
            default: 0,
        },
        maxTemperature: {
            type: Number,
            default: 100,
        },
        status: {
            type: String,
            enum: ["Available", "Out of Stock"],
            default: "Available",
        },
        ...baseModelSchema.obj,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

warehouseSchema.pre("findOneAndDelete", async function (next) {
    const warehouseId = this.getQuery()._id;

    const stockChecks = await stockCheckModel.findOne({ warehouseId: warehouseId });
    if (stockChecks) {
        return next(new Error("Cannot delete warehouse because it is used in stockChecks"));
    }
    const outputs = await outputModel.findOne({ warehouseId: warehouseId });
    if (outputs) {
        return next(new Error("Cannot delete warehouse because it is used in outputs"));
    }
    const warehouseChecks = await warehouseCheckModel.findOne({ warehouseId: warehouseId });
    if (warehouseChecks) {
        return next(new Error("Cannot delete warehouse because it is used in warehouseChecks"));
    }
    const inputs = await inputModel.findOne({ warehouseId: warehouseId });
    if (inputs) {
        return next(new Error("Cannot delete warehouse because it is used in inputs"));
    }
    const stockTransactions = await stockTransactionModel.findOne({ warehouseId: warehouseId });
    if (stockTransactions) {
        return next(new Error("Cannot delete warehouse because it is used in stockTransactions"));
    }
    const warehouseStorages = await warehouseStorageModel.findOne({ warehouseId: warehouseId });
    if (warehouseStorages) {
        return next(new Error("Cannot delete warehouse because it is used in warehouseStorages"));
    }

    next();
})

module.exports = mongoose.model(DOCUMENT_NAME, warehouseSchema);
