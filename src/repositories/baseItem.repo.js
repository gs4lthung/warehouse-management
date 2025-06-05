const { SELECT_BASEITEM } = require("../configs/baseitem.config");
const { SELECT_ITEM } = require("../configs/item.config");
const { NotFoundRequestError } = require("../core/responses/error.response");
const baseItemModel = require("../models/baseItem.model");
const inputDetailModel = require("../models/inputDetail.model");
const itemModel = require("../models/item.model");
const warehouseStorageModel = require("../models/warehouseStorage.model");
const { getAllItems } = require("./item.repo");

const getStorageQuantityOfBaseItem = async ({ id }) => {
  const baseItemHolder = await baseItemModel
    .findOne({ _id: id, isDeleted: false })
    .lean();
  if (!baseItemHolder) throw new NotFoundRequestError("Not found base item");

  const result = await warehouseStorageModel.aggregate([
    {
      $match: {
        itemId:
        {
          $in: await itemModel.distinct("_id", { baseItemId: id, status: "Available", isDeleted: false })
        }
      }
    },
    {
      $group: {
        _id: null,
        totalQuantity: { $sum: "$quantity" }
      }
    }
  ])

  return result.length > 0 ? result[0].totalQuantity : null;
};

const getAvgInputPriceOfBaseItem = async ({ id }) => {
  const baseItemHolder = await baseItemModel
    .findOne({ _id: id, isDeleted: false })
    .lean();
  if (!baseItemHolder) throw new NotFoundRequestError("Not found base item");

  const result = await inputDetailModel.aggregate([
    {
      $match: {
        itemId: {
          $in: await itemModel.distinct("_id", { baseItemId: id, status: "Available", isDeleted: false })
        },
        isDeleted: false
      }
    },
    {
      $group: {
        _id: null,
        avgPrice: { $avg: "$inputPrice" }
      }
    }
  ]);

  return result.length > 0 ? result[0].avgPrice : null;
};

const getAllBaseItem = async ({
  limit,
  sort,
  page,
  filter,
  select,
  expand,
}) => {
  const skip = (page - 1) * Number(limit);
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const populateOptions = {
    BaseItems: {
      select: SELECT_BASEITEM.DEFAULT,
    },
  };

  const populateFields = expand
    ? expand
      .split(" ")
      .map((field) => populateOptions[field])
      .filter(Boolean)
    : [];

  let baseItems = await baseItemModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(`${select}`)
    .populate(populateFields)
    .lean();

  const totalBaseItems = await baseItemModel.countDocuments(filter);
  const totalPages = Math.ceil(totalBaseItems / limit);

  return {
    baseItems,
    page: Number(page),
    totalPages: totalPages,
    limit: limit,
  };
};
module.exports = { getAllBaseItem, getAvgInputPriceOfBaseItem, getStorageQuantityOfBaseItem };
