const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");

const DOCUMENT_NAME = "WarehouseStorage";
const COLLECTION_NAME = "WarehouseStorages";

var warehouseStorage = new mongoose.Schema(
    {
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
        batchNumber: {
            type: String,
            trim: true,
            unique: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        ...baseModelSchema.obj,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, warehouseStorage);
