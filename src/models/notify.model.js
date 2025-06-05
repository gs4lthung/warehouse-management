const { default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Notify";
const COLLECTION_NAME = "Notifies";

var notifySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        task: {
            type: String,
            required: true,
        },
        navigatePage: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["success", "info", "warning", "error"]
        },
        isRead: {
            type: Boolean,
            default: false,
        }
    },
    {
        collection: COLLECTION_NAME,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, notifySchema);
