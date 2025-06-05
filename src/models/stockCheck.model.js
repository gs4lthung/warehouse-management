const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");
const stockCheckDetailModel = require("./stockCheckDetail.model");

const DOCUMENT_NAME = "StockCheck";
const COLLECTION_NAME = "StockChecks";

var stockCheckSchema = new mongoose.Schema(
    {
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Done", "Cancelled"],
            default: "Pending",
        },
        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        inventoryStaffIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }],
        fromDate: {
            type: Date,
            required: true,
        },
        toDate: {
            type: Date,
            required: true,
        },
        cancelReason: {
            type: String,
            trim: true,
        },
        ...baseModelSchema.obj,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

stockCheckSchema.pre("findOneAndDelete", async function (next) {
    const stockCheckId = this.getQuery()._id;
    const stockCheckDetails = await stockCheckDetailModel.findOne({ stockCheckId: stockCheckId });
    if (stockCheckDetails) {
        return next(new Error("Cannot delete stockCheck because it is used in stockCheckDetails"));
    }
    next();
})

module.exports = mongoose.model(DOCUMENT_NAME, stockCheckSchema);
