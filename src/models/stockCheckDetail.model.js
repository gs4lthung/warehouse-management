const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");

const DOCUMENT_NAME = "StockCheckDetail";
const COLLECTION_NAME = "StockCheckDetails";

var stockCheckDetailSchema = new mongoose.Schema(
    {
        stockCheckId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StockCheck',
            required: true,
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        systemQuantity: {
            type: Number,
            required: true,
        },
        actualQuantity: {
            type: Number,
        },
        difference: {
            type: Number,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Done"],
            default: "Pending",
        },
        ...baseModelSchema.obj,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, stockCheckDetailSchema);
