const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");
const itemModel = require("./item.model");

const DOCUMENT_NAME = "System";
const COLLECTION_NAME = "Systems";

var systemSchema = new mongoose.Schema({
    expiredMedicineDate: {
        type: Number,
        required: true,
        default: 7776000000
    },
    almostExpiredMedicineDate: {
        type: Number,
        required: true,
        default: 2592000000
    },
    checkMedicinesConditionInterval: {
        type: String,
        required: true,
        default: "*/1 * * * *",
    },
    checkStockRequestDateInterval: {
        type: String,
        required: true,
        default: "*/1 * * * *",
    },
    checkWarehouseCheckDateInterval: {
        type: String,
        required: true,
        default: "*/1 * * * *",
    },
    checkOutputRequestDateInterval: {
        type: String,
        required: true,
        default: "*/1 * * * *",
    },
    normalOutputPricePercentage: {
        type: Number,
        required: true,
        default: 0.2,
    },
    almostExpiredOutputPricePercentage: {
        type: Number,
        required: true,
        default: 0.8,
    },

    ...baseModelSchema.obj,
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

systemSchema.pre("create", async function (next) {
    const system = await this.findOne();
    if (system) {
        return next(new Error("System already exists"));
    }
    next();
})

module.exports = mongoose.model(DOCUMENT_NAME, systemSchema);