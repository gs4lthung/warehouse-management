const {
  POPULATE_INPUT_DETAILS,
  POPULATE_INPUT,
} = require("../configs/input.config");
const { USER_ROLES } = require("../configs/user.config");
const {
  NotFoundRequestError,
  BadRequestError,
} = require("../core/responses/error.response");
const baseItemModel = require("../models/baseItem.model");
const itemModel = require("../models/item.model");
const inputModel = require("../models/input.model");
const inputDetailModel = require("../models/inputDetail.model");
const userModel = require("../models/user.model");
const warehouseModel = require("../models/warehouse.model");
const {
  getAllInputRequests,
  getAllInputDetails,
  getAllInputStatistics,
} = require("../repositories/input.repo");
const WarehouseService = require("./warehouse.service");
const { generateMedicineCode } = require("../utils/medicine.util");
const { notifyUser } = require("../../socket");
const systemModel = require("../models/system.model");
const mongoose = require("mongoose");

class InputService {
  static getAllInputRequests = async ({
    limit,
    sort,
    page,
    filter,
    select,
    expand,
  }) => {
    return await getAllInputRequests({
      limit,
      sort,
      page,
      filter,
      select,
      expand,
    });
  };

  static getInputRequest = async ({ id }) => {
    const inputHolder = await inputModel
      .findOne({ _id: id })
      .populate(POPULATE_INPUT)
      .lean();

    if (!inputHolder) throw new NotFoundRequestError("Input request not found");
    const inputDetailHolders = await inputDetailModel
      .find({ inputId: id })
      .populate([
        POPULATE_INPUT_DETAILS[1],
        POPULATE_INPUT_DETAILS[2],
        POPULATE_INPUT_DETAILS[3],
      ])
      .lean();
    if (!inputDetailHolders || inputDetailHolders.length === 0)
      throw new NotFoundRequestError("Input details not found");

    return { input: inputHolder, inputDetails: inputDetailHolders };
  };

  static getAllInputDetails = async ({
    limit,
    sort,
    page,
    filter,
    select,
    expand,
  }) => {
    return await getAllInputDetails({
      limit,
      sort,
      page,
      filter,
      select,
      expand,
    });
  };

  static getInputDetail = async ({ id }) => {
    const inputDetailHolder = await inputDetailModel
      .findOne({ _id: id, isDeleted: false })
      .populate(POPULATE_INPUT_DETAILS)
      .lean();

    if (!inputDetailHolder)
      throw new NotFoundRequestError("Input detail not found");

    return inputDetailHolder;
  };

  static updateInputDetail = async ({
    id,
    requestQuantity,
    actualQuantity,
    inputPrice,
    manufactureDate,
    expiredDate,
    status,
    requesterId,
  }) => {
    const inputDetailHolder = await inputDetailModel.findOne({
      _id: id,
    });
    if (!inputDetailHolder)
      throw new NotFoundRequestError("Input detail not found");
    if (inputDetailHolder.status === "Done") throw new BadRequestError("Cannot update DONE input detail");

    if (requestQuantity && requestQuantity < 0)
      throw new BadRequestError("Invalid request quantity");
    if (actualQuantity && actualQuantity < 0)
      throw new BadRequestError("Invalid actual quantity");
    if (inputPrice && inputPrice < 0)
      throw new BadRequestError("Invalid input price");
    if (status && !["Pending", "Done"].includes(status))
      throw new BadRequestError("Invalid status");
    if (requesterId) {
      const requesterHolder = await userModel.findOne({
        _id: requesterId,
        isDeleted: false,
      });
      if (!requesterHolder)
        throw new NotFoundRequestError("Requester not found");
    }

    if (inputPrice) {
      const systemHolder = await systemModel.findOne({});
      inputDetailHolder.suggestedOutputPrice = (
        inputPrice *
        (1 + systemHolder.normalOutputPricePercentage)
      ).toFixed(2);
      await inputDetailHolder.save();
      const inputHolder = await inputModel.findOne({
        _id: inputDetailHolder.inputId,
      });
      if (!inputHolder)
        throw new NotFoundRequestError("Input request not found");
      const inputDetailHolders = await inputDetailModel.find({
        inputId: inputHolder._id,
      });
      if (!inputDetailHolders || inputDetailHolders.length === 0)
        throw new NotFoundRequestError("Input details not found");
      let totalInputPrice = 0;
      for (let inputDetail of inputDetailHolders) {
        if (inputDetail.inputPrice) totalInputPrice += inputDetail.inputPrice;
      }
      console.log(totalInputPrice);
      inputHolder.totalPrice = totalInputPrice;
      await inputHolder.save();
    }

    if (manufactureDate || expiredDate) {
      const itemHolder = await itemModel.findOne({
        _id: inputDetailHolder.itemId,
      });
      if (!itemHolder) throw new NotFoundRequestError("Item not found");

      if (
        manufactureDate &&
        expiredDate &&
        new Date(manufactureDate) >= new Date(expiredDate)
      )
        throw new BadRequestError("Invalid date range");
      if (manufactureDate) itemHolder.manufactureDate = manufactureDate;
      if (expiredDate) itemHolder.expiredDate = expiredDate;
      await itemHolder.save();
    }

    inputDetailHolder.requestQuantity =
      requestQuantity || inputDetailHolder.requestQuantity;
    inputDetailHolder.actualQuantity =
      actualQuantity || inputDetailHolder.actualQuantity;
    inputDetailHolder.inputPrice = inputPrice || inputDetailHolder.inputPrice;
    inputDetailHolder.status = status || inputDetailHolder.status;
    inputDetailHolder.updatedBy = requesterId || inputDetailHolder.updatedBy;
    await inputDetailHolder.save();

    return;
  };

  static createInputRequest = async ({
    reportStaffId,
    supplierId,
    description,
    inputDetails,
    session,
  }) => {
    if (
      !reportStaffId ||
      !supplierId ||
      !Array.isArray(inputDetails) ||
      inputDetails.length === 0
    ) {
      throw new BadRequestError("Invalid input");
    }

    const reportStaffHolder = await userModel
      .findOne({
        _id: reportStaffId,
        role: USER_ROLES.REPORT_STAFF,
        isDeleted: false,
      })
      .lean();
    if (!reportStaffHolder)
      throw new NotFoundRequestError("Report staff not found");

    const supplierHolder = await userModel
      .findOne({
        _id: supplierId,
        role: USER_ROLES.SUPPLIER,
        isDeleted: false,
      })
      .lean();
    if (!supplierHolder) throw new NotFoundRequestError("Supplier not found");

    let newInput;

    const now = new Date();
    newInput = await inputModel.create(
      [
        {
          reportStaffId,
          supplierId,
          description,
          status: "Pending",
          batchNumber: `${now.getDate()}${now.getMonth() + 1
            }${now.getFullYear()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}-INP`,
        },
      ],
      { session }
    );

    for (let inputDetail of inputDetails) {
      const { baseItemId, quantity } = inputDetail;

      const baseItem = await baseItemModel
        .findOne({ _id: baseItemId, isDeleted: false })
        .lean();
      if (!baseItem) throw new NotFoundRequestError("Base item not found");

      const warehouseHolder = await warehouseModel.findOne({
        category: baseItem.storageType,
      });

      const newItem = await itemModel.create(
        [
          {
            baseItemId,
            code: generateMedicineCode(baseItemId),
            status: "Not Available",
          },
        ],
        { session }
      );

      await inputDetailModel.create(
        [
          {
            warehouseId: warehouseHolder._id,
            inputId: newInput[0]._id,
            itemId: newItem[0]._id,
            requestQuantity: quantity,
          },
        ],
        { session }
      );
    }

    return newInput[0];
  };

  static cloneInputRequest = async ({
    reportStaffId,
    supplierId,
    description,
    inputDetails,
    oldInputId,
    session,
  }) => {
    if (!reportStaffId) throw new BadRequestError("Missing reportStaffId");
    if (!oldInputId) throw new BadRequestError("Missing oldInputId");

    if (!mongoose.Types.ObjectId.isValid(reportStaffId)) {
      throw new BadRequestError("Invalid reportStaffId format");
    }

    const reportStaffHolder = await userModel
      .findOne({
        _id: reportStaffId,
        role: USER_ROLES.REPORT_STAFF,
        isDeleted: false,
      })
      .lean();
    if (!reportStaffHolder)
      throw new NotFoundRequestError("Report staff not found");

    let finalSupplierId = supplierId;
    let finalDescription = description;
    let finalInputDetails = [];

    if (!mongoose.Types.ObjectId.isValid(oldInputId)) {
      throw new BadRequestError("Invalid oldInputId format");
    }

    const oldInput = await inputModel
      .findOne({ _id: oldInputId, isDeleted: false })
      .lean();
    if (!oldInput)
      throw new NotFoundRequestError("Old input request not found");

    finalSupplierId = supplierId || oldInput.supplierId;
    finalDescription = description || oldInput.description + " (Cloned)";

    if (!finalSupplierId) throw new BadRequestError("Missing supplierId");
    if (!mongoose.Types.ObjectId.isValid(finalSupplierId)) {
      throw new BadRequestError("Invalid supplierId format");
    }

    const supplierHolder = await userModel
      .findOne({
        _id: finalSupplierId,
        role: USER_ROLES.SUPPLIER,
        isDeleted: false,
      })
      .lean();
    if (!supplierHolder) throw new NotFoundRequestError("Supplier not found");

    const clonedInputDetails = await inputDetailModel
      .find({ inputId: oldInputId })
      .lean();

    if (clonedInputDetails.length === 0) {
      throw new NotFoundRequestError("No input details found in the old request");
    }

    if (!inputDetails || inputDetails.length === 0) {
      finalInputDetails = clonedInputDetails.map((detail) => ({
        itemId: detail.itemId,
        quantity: detail.requestQuantity,
      }));
    } else {
      const inputDetailsMap = new Map();

      for (const detail of inputDetails) {
        if (!detail.itemId || !mongoose.Types.ObjectId.isValid(detail.itemId)) {
          throw new BadRequestError("Invalid itemId in inputDetails");
        }
        if (!detail.quantity || detail.quantity <= 0) {
          throw new BadRequestError("Invalid quantity in inputDetails");
        }
        inputDetailsMap.set(detail.itemId.toString(), detail.quantity);
      }
      for (const detail of clonedInputDetails) {
        const itemIdString = detail.itemId.toString();
        if (inputDetailsMap.has(itemIdString)) {
          finalInputDetails.push({
            itemId: detail.itemId,
            quantity: inputDetailsMap.get(itemIdString),
          });
          inputDetailsMap.delete(itemIdString);
        } else {
          finalInputDetails.push({
            itemId: detail.itemId,
            quantity: detail.requestQuantity,
          });
        }
      }

      for (const [itemId, quantity] of inputDetailsMap) {
        finalInputDetails.push({
          itemId,
          quantity,
        });
      }
    }

    if (finalInputDetails.length === 0) {
      throw new BadRequestError("Input details cannot be empty");
    }

    const now = new Date();
    const newInput = await inputModel.create(
      [
        {
          reportStaffId,
          supplierId: finalSupplierId,
          description: finalDescription,
          status: "Pending",
          batchNumber: `${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}-INP`,
        },
      ],
      { session }
    );

    const processedItemIds = new Set();

    for (let inputDetail of finalInputDetails) {
      const itemIdString = inputDetail.itemId.toString();
      if (processedItemIds.has(itemIdString)) {
        console.warn(`Duplicate itemId ${itemIdString} skipped`);
        continue;
      }
      processedItemIds.add(itemIdString);

      const item = await itemModel
        .findOne({
          _id: inputDetail.itemId,
          isDeleted: false,
        })
        .lean();
      if (!item) throw new NotFoundRequestError("Item not found");

      const baseItem = await baseItemModel
        .findOne({ _id: item.baseItemId, isDeleted: false })
        .lean();
      if (!baseItem) throw new NotFoundRequestError("BaseItem not found");

      const warehouseHolder = await warehouseModel
        .findOne({
          category: baseItem.storageType,
        })
        .lean();
      if (!warehouseHolder)
        throw new NotFoundRequestError("Warehouse not found for the item");

      const newItem = await itemModel.create(
        [
          {
            baseItemId: baseItem._id,
            code: generateMedicineCode(baseItem.name),
            status: "Not Available",
          },
        ],
        { session }
      );

      await inputDetailModel.create(
        [
          {
            warehouseId: warehouseHolder._id,
            inputId: newInput[0]._id,
            itemId: newItem[0]._id,
            requestQuantity: inputDetail.quantity,
          },
        ],
        { session }
      );
    }

    return newInput[0];
  };

  static approveInputRequest = async ({ id, managerId }) => {
    if (!id || !managerId) throw new BadRequestError("Invalid input");

    const inputHolder = await inputModel.findOne({
      _id: id,
      status: "Pending",
      isDeleted: false,
    });
    if (!inputHolder) throw new NotFoundRequestError("Input request not found");

    const managerHolder = await userModel
      .findOne({
        _id: managerId,
        role: USER_ROLES.MANAGER,
        isDeleted: false,
      })
      .lean();
    if (!managerHolder) throw new NotFoundRequestError("Manager not found");

    inputHolder.status = "Approved";
    inputHolder.managerId = managerId;
    await inputHolder.save();

    await notifyUser({
      userId: inputHolder.supplierId,
      task: `Your input request has been approved`,
      navigatePage: "inventoryrequestsuppier",
      type: "success",
    });

    return;
  };

  static updateInputRequest = async ({
    id,
    description,
    fromDate,
    toDate,
    inventoryStaffIds,
  }) => {
    if (
      !id ||
      (inventoryStaffIds &&
        (!Array.isArray(inventoryStaffIds) || inventoryStaffIds.length === 0))
    )
      throw new BadRequestError("Invalid input");

    const inputHolder = await inputModel.findOne({
      _id: id,
      status: ["Pending", "Approved", "Assigned"],
      isDeleted: false,
    });
    if (!inputHolder) throw new NotFoundRequestError("Input request not found");

    if (fromDate && toDate && fromDate > toDate)
      throw new BadRequestError("Invalid date range");

    if (fromDate && toDate && fromDate < new Date().getTime())
      throw new BadRequestError("Invalid date range");

    if (inventoryStaffIds) {
      const inventoryStaffHolders = await userModel.find({
        _id: { $in: inventoryStaffIds },
        role: USER_ROLES.INVENTORY_STAFF,
        isDeleted: false,
      });
      if (!inventoryStaffHolders || inventoryStaffHolders.length === 0)
        throw new NotFoundRequestError("Inventory staffs not found");

      inputHolder.inventoryStaffIds = inventoryStaffIds;
    }

    inputHolder.description = description || inputHolder.description;
    inputHolder.fromDate = fromDate || inputHolder.fromDate;
    inputHolder.toDate = toDate || inputHolder.toDate;
    await inputHolder.save();

    for (let inventoryStaffId of inputHolder.inventoryStaffIds) {
      await notifyUser({
        userId: inventoryStaffId,
        task: "You have assigned to an input request",
        navigatePage: "inputitemcheck",
        type: "info",
      });
    }
    return;
  };

  static assignInputRequest = async ({
    id,
    fromDate,
    toDate,
    inventoryStaffIds,
  }) => {
    if (
      !id ||
      !Array.isArray(inventoryStaffIds) ||
      inventoryStaffIds.length === 0
    )
      throw new BadRequestError("Invalid input");
    if (fromDate && toDate && fromDate > toDate)
      throw new BadRequestError("Invalid date range");
    if (fromDate && toDate && fromDate < new Date().getTime())
      throw new BadRequestError("Invalid date range");

    const inputHolder = await inputModel.findOne({
      _id: id,
      status: "Approved",
      isDeleted: false,
    });
    if (!inputHolder) throw new NotFoundRequestError("Input request not found");

    const inventoryStaffHolders = await userModel.find({
      _id: { $in: inventoryStaffIds },
      role: USER_ROLES.INVENTORY_STAFF,
      isDeleted: false,
    });
    if (!inventoryStaffHolders || inventoryStaffHolders.length === 0)
      throw new NotFoundRequestError("Inventory staffs not found");

    inputHolder.status = "Assigned";
    inputHolder.inventoryStaffIds = inventoryStaffIds;
    inputHolder.fromDate = fromDate;
    inputHolder.toDate = toDate;
    await inputHolder.save();

    for (let inventoryStaffId of inventoryStaffIds) {
      await notifyUser({
        userId: inventoryStaffId,
        task: "You have assigned to an input request",
        navigatePage: "inputitemcheck",
        type: "info",
      });
    }
    return;
  };

  static completeInputRequest = async ({ id, session }) => {
    if (!id) throw new BadRequestError("Invalid input");

    const inputHolder = await inputModel.findOne({
      _id: id,
      status: "Assigned",
      isDeleted: false,
    });

    if (!inputHolder) throw new NotFoundRequestError("Input request not found");
    const inputDetailHolders = await inputDetailModel.find({ inputId: id });
    if (!inputDetailHolders || inputDetailHolders.length === 0)
      throw new NotFoundRequestError("Input details not found");

    for (let inputDetail of inputDetailHolders) {
      await WarehouseService.handleStorageTransaction({
        inputId: inputHolder._id,
        warehouseId: inputDetail.warehouseId,
        itemId: inputDetail.itemId,
        quantity: inputDetail.actualQuantity,
        transactionType: "Input",
        description: `Input request ${inputDetail._id} has been completed`,
        session: session,
      });
    }

    inputHolder.status = "Done";
    await inputHolder.save({ session: session });

    await notifyUser({
      userId: inputHolder.supplierId,
      task: `Your input request has been completed`,
      navigatePage: "/inventoryrequestsuppier",
      type: "success",
    });

    return;
  };

  static cancelInputRequest = async ({ id, cancelReason }) => {
    if (!id || !cancelReason) throw new BadRequestError("Invalid input");

    const inputHolder = await inputModel.findOne({
      _id: id,
      status: { $in: ["Pending", "Approved"] },
      isDeleted: false,
    });
    if (!inputHolder) throw new NotFoundRequestError("Input request not found");

    const inputDetailHolders = await inputDetailModel.find({
      inputId: id,
      isDeleted: false
    });
    if (!inputDetailHolders || inputDetailHolders.length === 0) {
      throw new NotFoundRequestError("Input details not found");
    }

    for (let inputDetail of inputDetailHolders) {
      inputDetail.status = "Cancelled";
      await inputDetail.save();
    }

    inputHolder.status = "Cancelled";
    inputHolder.cancelReason = cancelReason;
    await inputHolder.save();

    await notifyUser({
      userId: inputHolder.supplierId,
      task: `Your input request has been cancelled`,
      navigatePage: "inventoryrequestsuppier",
      type: "error",
    });

    return;
  };
}

module.exports = InputService;
