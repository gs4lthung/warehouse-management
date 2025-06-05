const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");

const DOCUMENT_NAME = "StockTransaction";
const COLLECTION_NAME = "StockTransactions";

var stockTransactionSchema = new mongoose.Schema(
    {
        description: {
            type: String,
        },
        transactionType: {
            type: String,
            enum: ["Input", "Output"],
            required: true,
        },
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true,
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },

        ...baseModelSchema.obj,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, stockTransactionSchema);
