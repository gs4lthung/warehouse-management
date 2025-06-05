const { SELECT_BASEITEM } = require("../configs/baseitem.config");
const { SELECT_ITEM } = require("../configs/item.config");
const { SELECT_INPUT } = require("../configs/input.config");
const { SELECT_USER } = require("../configs/user.config");
const { SELECT_WAREHOUSE } = require("../configs/warehouse.config");
const inputModel = require("../models/input.model");
const inputDetailModel = require("../models/inputDetail.model");
const itemModel = require("../models/item.model");

const getAllInputRequests = async ({
  limit,
  sort,
  page,
  filter,
  select,
  expand,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const populateOptions = {
    supplier: { path: "supplierId", select: SELECT_USER.DEFAULT },
    manager: { path: "managerId", select: SELECT_USER.DEFAULT },
    inventoryStaffs: { path: "inventoryStaffIds", select: SELECT_USER.DEFAULT },
    reportStaff: { path: "reportStaffId", select: SELECT_USER.DEFAULT },
  };

  const populateFields = expand
    ? expand
      .split(" ")
      .map((field) => populateOptions[field])
      .filter(Boolean)
    : [];

  const inputs = await inputModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .populate(populateFields);

  const totalInputs = await inputModel.countDocuments(filter);
  const totalPages = Math.ceil(totalInputs / limit);

  return {
    inputs: inputs,
    page: Number(page),
    totalPages: totalPages,
  };
};

const getAllInputDetails = async ({
  limit,
  sort,
  page,
  filter,
  select,
  expand,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const populateOptions = {
    warehouse: {
      path: "warehouseId",
      select: SELECT_WAREHOUSE.DEFAULT,
    },
    item: {
      path: "itemId",
      select: SELECT_ITEM,
      populate: { path: "baseItemId", select: SELECT_BASEITEM.DEFAULT },
    },
    updatedBy: {
      path: 'updatedBy',
      select: SELECT_USER.DEFAULT
    }
  };

  const populateFields = expand
    ? expand
      .split(" ")
      .map((field) => populateOptions[field])
      .filter(Boolean)
    : [];

  const inputDetails = await inputDetailModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .populate(populateFields).lean();

  const itemIds = inputDetails.map((inputDetail) => inputDetail.itemId);
  const items = await itemModel.find({ _id: { $in: itemIds } });
  for (let inputDetail of inputDetails) {
    for (let item of items) {
      if (inputDetail.itemId.toString() === item._id.toString()) {
        inputDetail.item = item;
      }
    }
  }

  const totalInputDetails = await inputModel.countDocuments(filter);
  const totalPages = Math.ceil(totalInputDetails / limit);

  return {
    inputDetails: inputDetails,
    page: Number(page),
    totalPages: totalPages,
  };
};

module.exports = {
  getAllInputRequests,
  getAllInputDetails,
};