const { default: mongoose } = require("mongoose");
const baseModelSchema = require("./base.model");
const warehouseCheckModel = require("./warehouseCheck.model");
const stockCheckModel = require("./stockCheck.model");
const outputModel = require("./output.model");
const inputModel = require("./input.model");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

var userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      maxLength: 50,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Report Staff", "Inventory Staff", "Supplier", "Customer"],
      default: "Customer",
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    ...baseModelSchema.obj,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()._id;

  const managerWarehouseChecks = await warehouseCheckModel.findOne({ managerId: userId });
  if (managerWarehouseChecks) {
    return next(new Error("Cannot delete user because it is used in warehouseChecks"));
  }

  const inventoryStaffWarehouseChecks = await warehouseCheckModel.findOne({ inventoryStaffId: userId });
  if (inventoryStaffWarehouseChecks) {
    return next(new Error("Cannot delete user because it is used in warehouseChecks"));
  }

  const managerStockChecks = await stockCheckModel.findOne({ managerId: userId });
  if (managerStockChecks) {
    return next(new Error("Cannot delete user because it is used in stockChecks"));
  }

  const inventoryStaffStockChecks = await stockCheckModel.findOne({ inventoryStaffId: userId });
  if (inventoryStaffStockChecks) {
    return next(new Error("Cannot delete user because it is used in stockChecks"));
  }

  const customerOutputs = await outputModel.findOne({ customerId: userId });
  if (customerOutputs) {
    return next(new Error("Cannot delete user because it is used in outputs"));
  }

  const managerOutputs = await outputModel.findOne({ managerId: userId });
  if (managerOutputs) {
    return next(new Error("Cannot delete user because it is used in outputs"));
  }

  const inventoryStaffOutputs = await outputModel.findOne({ inventoryStaffId: userId });
  if (inventoryStaffOutputs) {
    return next(new Error("Cannot delete user because it is used in outputs"));
  }

  const supplierInputs = await inputModel.findOne({ supplierId: userId });
  if (supplierInputs) {
    return next(new Error("Cannot delete user because it is used in inputs"));
  }

  const managerInputs = await inputModel.findOne({ managerId: userId });
  if (managerInputs) {
    return next(new Error("Cannot delete user because it is used in inputs"));
  }
  
  const inventoryStaffInputs = await inputModel.findOne({ inventoryStaffId: userId });
  if (inventoryStaffInputs) {
    return next(new Error("Cannot delete user because it is used in inputs"));
  }

  next();
})

module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
