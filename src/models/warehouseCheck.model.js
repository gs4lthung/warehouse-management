const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");

const DOCUMENT_NAME = "WarehouseCheck";
const COLLECTION_NAME = "WarehouseChecks";

var warehouseCheckSchema = new mongoose.Schema(
    {
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warehouse",
            required: true,
        },
        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        inventoryStaffIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }],
        description: {
            type: String,
            required: true,
        },
        temperature: {
            type: Number,
        },
        thresholdLevel: {
            type: String,
            enum: ["Low", "Normal", "High", "Full"],
        },
        condition: {
            type: String,
            enum: ["Good", "Need Repair", "Critical"],
        },
        status: {
            type: String,
            enum: ["Pending", "Cancelled", "Done"],
            default: "Pending",
        },
        fromDate: {
            type: Date,
        },
        toDate: {
            type: Date,
        },
        ...baseModelSchema.obj,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);
module.exports = mongoose.model(DOCUMENT_NAME, warehouseCheckSchema);
