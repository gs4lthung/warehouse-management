const { SELECT_BASEITEM } = require("../configs/baseitem.config");
const { SELECT_ITEM } = require("../configs/item.config");
const { SELECT_OUTPUT, POPULATE_OUTPUT } = require("../configs/output.config");
const { SELECT_USER } = require("../configs/user.config");
const { SELECT_WAREHOUSE } = require("../configs/warehouse.config");
const outputModel = require("../models/output.model");
const outputDetailModel = require("../models/outputDetail.model");

const getAllOutputRequests = async ({
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
    customer: { path: "customerId", select: SELECT_USER.DEFAULT },
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

  const outputs = await outputModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .populate(populateFields);

  const totalOutputs = await outputModel.countDocuments(filter);
  const totalPages = Math.ceil(totalOutputs / limit);

  return {
    outputs: outputs,
    page: Number(page),
    totalPages: totalPages,
  };
};

const getAllOutputDetails = async ({
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
    output: {
      path: "outputId",
      select: SELECT_OUTPUT,
      populate: POPULATE_OUTPUT,
    },
    item: {
      path: "itemId",
      select: SELECT_ITEM,
      populate: { path: "baseItemId", select: SELECT_BASEITEM.DEFAULT },
    },
  };

  const populateFields = expand
    ? expand
      .split(" ")
      .map((field) => populateOptions[field])
      .filter(Boolean)
    : [];

  const outputDetails = await outputDetailModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .populate(populateFields);

  const totalOutputDetails = await outputModel.countDocuments(filter);
  const totalPages = Math.ceil(totalOutputDetails / limit);

  return {
    outputDetails: outputDetails,
    page: Number(page),
    totalPages: totalPages,
  };
};

module.exports = {
  getAllOutputRequests,
  getAllOutputDetails,
};
