const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");

const DOCUMENT_NAME = "OutputDetail";
const COLLECTION_NAME = "OutputDetails";

var outputDetailSchema = new mongoose.Schema(
    {
        outputId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Output',
            required: true,
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        outputPrice: {
            type: Number,
            min: 0,
        },
        status: {
            type: String,
            enum: ["Pending", "Done"],
            default: "Pending",
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        ...baseModelSchema.obj,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, outputDetailSchema);
