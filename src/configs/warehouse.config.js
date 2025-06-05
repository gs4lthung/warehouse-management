const { SELECT_BASEITEM } = require("./baseitem.config");
const { SELECT_USER } = require("./user.config");

const SELECT_WAREHOUSE = {
    DEFAULT: 'name description category status',
}

const SELECT_WAREHOUSE_CHECK = {
    DEFAULT: 'warehouseId managerId inventoryStaffIds description fromDate toDate temperature thresholdLevel condition status',
}

const SELECT_WAREHOUSE_CHECK_DETAIL = {
    DEFAULT: 'warehouseCheckId description temperature thresholdLevel condition status'
}

const POPULATE_WAREHOUSE_CHECK = [
    { path: 'warehouseId', select: SELECT_WAREHOUSE.DEFAULT },
    { path: 'managerId', select: SELECT_USER.DEFAULT },
    { path: 'inventoryStaffIds', select: SELECT_USER.DEFAULT }
]

const SELECT_WAREHOUSE_STORAGE = 'warehouseId itemId batchNumber quantity'

const SELECT_STOCK_REQUEST = 'description status warehouseId managerId inventoryStaffIds fromDate toDate cancelReason'

const SELECT_STOCK_DETAIL = 'stockCheckId itemId systemQuantity actualQuantity difference description'

const SELECT_STOCK_TRANSACTION = 'warehouseId itemId description quantity transactionType'

const POPULATE_WAREHOUSE_STORAGES = [
    { path: 'warehouseId', select: SELECT_WAREHOUSE.DEFAULT },
    {
        path: 'itemId',
        select: 'baseItemId status',
        populate: { path: 'baseItemId', select: SELECT_BASEITEM.DEFAULT }
    }
]

const POPULATE_STOCK_TRANSACTIONS = [
    { path: 'warehouseId', select: SELECT_WAREHOUSE.DEFAULT },
    {
        path: 'itemId',
        select: 'baseItemId status',
        populate: { path: 'baseItemId', select: SELECT_BASEITEM.DEFAULT }
    }
]

const POPULATE_STOCK_DETAILS = [
    {
        path: 'stockCheckId', select: SELECT_STOCK_REQUEST,
        populate: [
            { path: 'warehouseId', select: SELECT_WAREHOUSE.DEFAULT },
            { path: 'managerId', select: SELECT_USER.DEFAULT },
            { path: 'inventoryStaffIds', select: SELECT_USER.DEFAULT }
        ]
    },
    {
        path: 'itemId',
        select: 'baseItemId status',
        populate: { path: 'baseItemId', select: SELECT_BASEITEM.DEFAULT }
    },
]

module.exports = {
    SELECT_WAREHOUSE,
    SELECT_WAREHOUSE_CHECK,
    SELECT_WAREHOUSE_CHECK_DETAIL,
    SELECT_WAREHOUSE_STORAGE,
    SELECT_STOCK_REQUEST,
    SELECT_STOCK_DETAIL,
    SELECT_STOCK_TRANSACTION,
    POPULATE_WAREHOUSE_STORAGES,
    POPULATE_STOCK_TRANSACTIONS,
    POPULATE_STOCK_DETAILS,
    POPULATE_WAREHOUSE_CHECK,
};