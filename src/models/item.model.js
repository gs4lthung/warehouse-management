const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");
const inputDetailModel = require("./inputDetail.model");
const stockCheckDetailModel = require("./stockCheckDetail.model");
const outputDetailModel = require("./outputDetail.model");
const warehouseStorageModel = require("./warehouseStorage.model");
const stockTransactionModel = require("./stockTransaction.model");

const DOCUMENT_NAME = "Item";
const COLLECTION_NAME = "Items";

var itemSchema = new mongoose.Schema({
    baseItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BaseItem',
        required: true,
    },
    code: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["Not Available","Almost Expired", "Expired", "Available", "Out of Stock"],
        default: "Not Available",
    },
    manufactureDate: {
        type: Date,
    },
    expiredDate: {
        type: Date,
    },
    unit: {
        type: String,
        required: true,
        trim: true,
        enum: ["Box", "Bottle", "Tablet", "Capsule", "Syrup", "Injection", "Pcs", "Set", "Other"],
        default: "Pcs",
    },
    ...baseModelSchema.obj,
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

itemSchema.pre("findOneAndDelete", async function (next) {
    const itemId = this.getQuery()._id;

    const inputDetails = await inputDetailModel.findOne({ itemId: itemId });
    if (inputDetails) {
        return next(new Error("Cannot delete itemId because it is used in inputDetails"));
    }
    const stockCheckDetails = await stockCheckDetailModel.findOne({ itemId: itemId });
    if (stockCheckDetails) {
        return next(new Error("Cannot delete itemId because it is used in stockCheckDetails"));
    }
    const outputDetails = await outputDetailModel.findOne({ itemId: itemId });
    if (outputDetails) {
        return next(new Error("Cannot delete itemId because it is used in outputDetails"));
    }
    const warehouseStorages = await warehouseStorageModel.findOne({ itemId: itemId });
    if (warehouseStorages) {
        return next(new Error("Cannot delete itemId because it is used in warehouseStorages"));
    }
    const stockTransactions = await stockTransactionModel.findOne({ itemId: itemId });
    if (stockTransactions) {
        return next(new Error("Cannot delete itemId because it is used in stockTransactions"));
    }
    if (this.expiredDate <= this.manufactureDate) {
        return next(new Error("Expired date must be larger than manufracture date"))
    }
    next();
})

module.exports = mongoose.model(DOCUMENT_NAME, itemSchema);