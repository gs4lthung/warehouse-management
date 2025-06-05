const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");

const DOCUMENT_NAME = "Output";
const COLLECTION_NAME = "Outputs";

var outputSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            trim: true,
        },
        cancelReason: {
            type: String,
            trim: true,
        },
        batchNumber: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Assigned", "Cancelled", "Done"],
            default: "Pending",
        },
        totalPrice: {
            type: Number,
            default: 0,
            min: 0,
        },
        fromDate: {
            type: Date,
        },
        toDate: {
            type: Date,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        inventoryStaffIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        reportStaffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        ...baseModelSchema.obj,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, outputSchema);
