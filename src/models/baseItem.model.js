const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");
const itemModel = require("./item.model");

const DOCUMENT_NAME = "BaseItem";
const COLLECTION_NAME = "BaseItems";

var baseItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    genericName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        enum: ["Medicine", "Equipment", "Other"],
        default: "Medicine",
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    countryOfOrigin: {
        type: String,
        required: true,
        trim: true,
    },
    indication: {
        type: String,
        trim: true,
    },
    contraindication: {
        type: String,
        trim: true,
    },
    sideEffect: {
        type: String,
        trim: true,
    },
    storageType: {
        type: String,
        enum: ["Normal", "Cold", "Other"],
        default: "Normal",
    },
    ...baseModelSchema.obj,
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

baseItemSchema.pre("findOneAndDelete", async function (next) {
    const baseItemId = this.getQuery()._id;
    const items = await itemModel.findOne({ baseItemId: baseItemId });
    if (items) {
        return next(new Error("Cannot delete baseItem because it is used in items"));
    }
    next();
})

module.exports = mongoose.model(DOCUMENT_NAME, baseItemSchema);