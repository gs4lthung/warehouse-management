const { SELECT_BASEITEM } = require("./baseitem.config");
const { SELECT_ITEM } = require("./item.config");
const { SELECT_USER } = require("./user.config");
const { SELECT_WAREHOUSE } = require("./warehouse.config");

const SELECT_INPUT = 'description cancelReason batchNumber totalPrice fromDate toDate status supplierId reportStaffId managerId inventoryStaffIds';

const SELECT_INPUT_DETAILS = 'warehouseId inputId itemId requestQuantity actualQuantity suggestedOutputPrice inputPrice status updatedBy';


const POPULATE_INPUT = [
    {
        path: 'supplierId',
        select: SELECT_USER.DEFAULT
    },
    {
        path: 'managerId',
        select: SELECT_USER.DEFAULT
    },
    {
        path: 'inventoryStaffIds',
        select: SELECT_USER.DEFAULT
    },
    {
        path: 'reportStaffId',
        select: SELECT_USER.DEFAULT
    }
];

const POPULATE_INPUT_DETAILS = [
    {
        path: 'inputId',
        select: SELECT_INPUT,
        populate: POPULATE_INPUT
    },
    {
        path: 'itemId',
        select: SELECT_ITEM,
        populate: { path: 'baseItemId', select: SELECT_BASEITEM.DEFAULT }
    },
    {
        path: 'warehouseId',
        select: SELECT_WAREHOUSE.DEFAULT
    },
    {
        path: 'updatedBy',
        select: SELECT_USER.DEFAULT
    }
];

module.exports = { SELECT_INPUT, SELECT_INPUT_DETAILS, POPULATE_INPUT, POPULATE_INPUT_DETAILS };
