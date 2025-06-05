const { SELECT_BASEITEM } = require("../configs/baseitem.config");
const { SELECT_USER } = require("../configs/user.config");
const { SELECT_WAREHOUSE, SELECT_STOCK_REQUEST } = require("../configs/warehouse.config");
const stockCheckModel = require("../models/stockCheck.model");
const stockCheckDetailModel = require("../models/stockCheckDetail.model");
const stockTransactionModel = require("../models/stockTransaction.model");
const warehouseModel = require("../models/warehouse.model");
const warehouseCheckModel = require("../models/warehouseCheck.model");
const warehouseStorageModel = require("../models/warehouseStorage.model");

const getAllWarehouses = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    const warehouses = await warehouseModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(select)

    const totalWarehouses = await warehouseModel.countDocuments(filter);
    const totalPages = Math.ceil(totalWarehouses / limit);

    return {
        warehouses,
        page: Number(page),
        totalPages: totalPages,
    };
}

const getAllWarehouseChecks = async ({ limit, sort, page, filter, select, expand }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    const populateOptions = {
        warehouse: { path: 'warehouseId', select: SELECT_WAREHOUSE.DEFAULT },
        manager: { path: 'managerId', select: SELECT_USER.DEFAULT },
        inventoryStaffs: { path: 'inventoryStaffIds', select: SELECT_USER.DEFAULT }
    }

    const populateFields = expand
        ? expand.split(" ").map(field => populateOptions[field]).filter(Boolean)
        : [];

    const warehouseChecks = await warehouseCheckModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(select)
        .populate(populateFields)

    const totalWarehouseChecks = await warehouseCheckModel.countDocuments(filter);
    const totalPages = Math.ceil(totalWarehouseChecks / limit);

    return {
        warehouseChecks,
        page: Number(page),
        totalPages: totalPages,
    };
}

const getAllWarehouseStorages = async ({ limit, sort, page, filter, select, expand }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    const populateOptions = {
        warehouse: { path: 'warehouseId', select: SELECT_WAREHOUSE.DEFAULT },
        item: {
            path: 'itemId',
            select: 'baseItemId status',
            populate: { path: 'baseItemId', select: SELECT_BASEITEM.DEFAULT }
        },
    }

    const populateFields = expand
        ? expand.split(" ").map(field => populateOptions[field]).filter(Boolean)
        : [];

    const warehouseStorages = await warehouseStorageModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(select)
        .populate(populateFields)

    const totalWarehouseStorages = await warehouseStorageModel.countDocuments(filter);
    const totalPages = Math.ceil(totalWarehouseStorages / limit);

    return {
        warehouseStorages,
        page: Number(page),
        totalPages: totalPages,
    };
}

const getAllStockTransactions = async ({ limit, sort, page, filter, select, expand }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    const populateOptions = {
        warehouse: { path: 'warehouseId', select: SELECT_WAREHOUSE.DEFAULT },
        item: {
            path: 'itemId',
            select: 'baseItemId status',
            populate: { path: 'baseItemId', select: SELECT_BASEITEM.DEFAULT }
        }
    }

    const populateFields = expand
        ? expand.split(" ").map(field => populateOptions[field]).filter(Boolean)
        : [];

    const stockTransactions = await stockTransactionModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(select)
        .populate(populateFields)

    const totalStockTransactions = await stockTransactionModel
        .countDocuments(filter);
    const totalPages = Math.ceil(totalStockTransactions / limit);

    return {
        stockTransactions,
        page: Number(page),
        totalPages: totalPages,
    };
}

const getAllStockCheckRequests = async ({ limit, sort, page, filter, select, expand }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    const populateOptions = {
        warehouse: { path: 'warehouseId', select: SELECT_WAREHOUSE.DEFAULT },
        manager: { path: 'managerId', select: SELECT_USER.DEFAULT },
        inventoryStaffs: { path: 'inventoryStaffIds', select: SELECT_USER.DEFAULT }
    }

    const populateFields = expand
        ? expand.split(" ").map(field => populateOptions[field]).filter(Boolean)
        : [];

    const stockCheckRequests = await stockCheckModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(select)
        .populate(populateFields)

    const totalStockCheckRequests = await stockCheckModel.countDocuments(filter);
    const totalPages = Math.ceil(totalStockCheckRequests / limit);

    return {
        stockCheckRequests,
        page: Number(page),
        totalPages: totalPages,
    };
}

const getAllStockCheckDetails = async ({ limit, sort, page, filter, select, expand }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    const populateOptions = {
        stockCheck: {
            path: 'stockCheckId', select: SELECT_STOCK_REQUEST,
            populate: [
                { path: 'warehouseId', select: SELECT_WAREHOUSE.DEFAULT },
                { path: 'managerId', select: SELECT_USER.DEFAULT },
                { path: 'inventoryStaffIds', select: SELECT_USER.DEFAULT }
            ]
        },
        item: {
            path: 'itemId',
            select: 'baseItemId status',
            populate: { path: 'baseItemId', select: SELECT_BASEITEM.DEFAULT }
        },
    }

    const populateFields = expand
        ? expand.split(" ").map(field => populateOptions[field]).filter(Boolean)
        : [];

    const stockCheckDetails = await stockCheckDetailModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(select)
        .populate(populateFields)

    const totalStockCheckDetails = await stockCheckDetailModel.countDocuments(filter);
    const totalPages = Math.ceil(totalStockCheckDetails / limit);

    return {
        stockCheckDetails,
        page: Number(page),
        totalPages: totalPages,
    };
}

module.exports = {
    getAllWarehouses,
    getAllWarehouseChecks,
    getAllWarehouseStorages,
    getAllStockTransactions,
    getAllStockCheckRequests,
    getAllStockCheckDetails
}