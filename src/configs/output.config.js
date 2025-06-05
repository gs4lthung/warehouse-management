const { SELECT_BASEITEM } = require("./baseitem.config");
const { SELECT_USER } = require("./user.config");
const { SELECT_WAREHOUSE } = require("./warehouse.config");

const SELECT_OUTPUT = 'description cancelReason batchNumber status totalPrice fromDate toDate customerId reportStaffId managerId inventoryStaffIds'

const SELECT_OUTPUT_DETAILS = 'outputId itemId warehouseId quantity outputPrice status updatedBy'

const POPULATE_OUTPUT = [
    {
        path: 'customerId',
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
]

const POPULATE_OUTPUT_DETAILS =
    [
        {
            path: 'outputId',
            select: SELECT_OUTPUT,
            populate: POPULATE_OUTPUT
        },
        {
            path: 'warehouseId',
            select: SELECT_WAREHOUSE.DEFAULT
        },
        {
            path: 'itemId',
            select: 'baseItemId status',
            populate: { path: 'baseItemId', select: SELECT_BASEITEM.DEFAULT }
        },
        {
            path: 'updatedBy',
            select: SELECT_USER.DEFAULT
        }
    ]

module.exports = { SELECT_OUTPUT, SELECT_OUTPUT_DETAILS, POPULATE_OUTPUT, POPULATE_OUTPUT_DETAILS };