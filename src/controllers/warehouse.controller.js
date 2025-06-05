const { SELECT_WAREHOUSE_CHECK, SELECT_WAREHOUSE_CHECK_DETAIL } = require("../configs/warehouse.config")
const { OK, CREATED } = require("../core/responses/success.response")
const WarehouseService = require("../services/warehouse.service")

class WarehouseController {
    getAllWarehouses = async (req, res) => {
        new OK({
            message: "Get all warehouses successfully",
            metadata: await WarehouseService.getAllWarehouses({
                limit: req.query.limit || 1000,
                sort: req.query.sort || 'ctime',
                page: req.query.page || 1,
                filter: req.query.filter ? JSON.parse(req.query.filter) : FILTER_USER.NORMAL_USER, // http://localhost:8386/api/v1/users?filter={"isDeleted":false}
                select: req.query.select || SELECT_USER.DEFAULT
            })
        }).send(res)
    }

    getWarehouse = async (req, res) => {
        new OK({
            message: "Get warehouse successfully",
            metadata: await WarehouseService.getWarehouse({ id: req.params.id })
        }).send(res)
    }

    updateWarehouse = async (req, res) => {
        new OK({
            message: "Update warehouse successfully",
            metadata: await WarehouseService.updateWarehouse({
                id: req.params.id,
                ...req.body
            })
        })
    }

    deleteWarehouse = async (req, res) => {
        new OK({
            message: "Delete warehouse successfully",
            metadata: await WarehouseService.deleteWarehouse({ id: req.params.id })
        })
    }

    getAllWarehouseChecks = async (req, res) => {
        new OK({
            message: "Get all warehouse checks successfully",
            metadata: await WarehouseService.getAllWarehouseChecks({
                limit: req.query.limit || 1000,
                sort: req.query.sort || 'ctime',
                page: req.query.page || 1,
                filter: req.query.filter ? JSON.parse(req.query.filter) : { isDeleted: false },
                select: req.query.select || SELECT_WAREHOUSE_CHECK.DEFAULT,
                expand: req.query.expand || 'warehouse manager inventoryStaff'
            })
        }).send(res)
    }

    getWarehouseCheck = async (req, res) => {
        new OK({
            message: "Get warehouse check successfully",
            metadata: await WarehouseService.getWarehouseCheck({ id: req.params.id })
        }).send(res)
    }

    createWarehouseCheck = async (req, res) => {
        new CREATED({
            message: "Create warehouse check successfully",
            metadata: await WarehouseService.createWarehouseCheck(req.body)
        }).send(res)
    }

    updateWarehouseCheck = async (req, res) => {
        new OK({
            message: "Update warehouse check successfully",
            metadata: await WarehouseService.updateWarehouseCheck({
                id: req.params.id,
                ...req.body
            })
        }).send(res)
    }

    deleteWarehouseCheck = async (req, res) => {
        new OK({
            message: "Delete warehouse check successfully",
            metadata: await WarehouseService.deleteWarehouseCheck({ id: req.params.id })
        }).send(res)
    }

    getAllWarehouseStorages = async (req, res) => {
        new OK({
            message: "Get all warehouse storage successfully",
            metadata: await WarehouseService.getAllWarehouseStorages({
                limit: req.query.limit || 10,
                sort: req.query.sort || 'ctime',
                page: req.query.page || 1,
                filter: req.query.filter ? JSON.parse(req.query.filter) : { isDeleted: false }, // http://localhost:8386/api/v1/users?filter={"isDeleted":false}
                select: req.query.select || '',
                expand: req.query.expand || '',
            })
        }).send(res)
    }

    getWarehouseStorage = async (req, res) => {
        new OK({
            message: "Get warehouse storage successfully",
            metadata: await WarehouseService.getWarehouseStorage({
                id: req.params.id
            })
        }).send(res)
    }

    createWarehouseStorage = async (req, res) => {
        new CREATED({
            message: "Create warehouse storage successfully",
            metadata: await WarehouseService.createWarehouseStorage(req.body)
        }).send(res)
    }

    deleteWarehouseStorage = async (req, res) => {
        new OK({
            message: "Delete warehouse storage successfully",
            metadata: await WarehouseService.deleteWarehouseStorage({
                id: req.params.id
            })
        }).send(res)
    }

    getAllStockTransactions = async (req, res) => {
        new OK({
            message: "Get all stock transactions successfully",
            metadata: await WarehouseService.getAllStockTransactions({
                limit: req.query.limit || 10,
                sort: req.query.sort || 'ctime',
                page: req.query.page || 1,
                filter: req.query.filter ? JSON.parse(req.query.filter) : { isDeleted: false }, // http://localhost:8386/api/v1/users?filter={"isDeleted":false}
                select: req.query.select || '',
                expand: req.query.expand || '',
            })
        }).send(res)
    }

    getStockTransaction = async (req, res) => {
        new OK({
            message: "Get stock transaction successfully",
            metadata: await WarehouseService.getStockTransaction({
                id: req.params.id
            })
        }).send(res)
    }

    getAllStockCheckRequests = async (req, res) => {
        new OK({
            message: "Get all stock check request successfully",
            metadata: await WarehouseService.getAllStockCheckRequests({
                limit: req.query.limit || 10,
                sort: req.query.sort || 'ctime',
                page: req.query.page || 1,
                filter: req.query.filter ? JSON.parse(req.query.filter) : { isDeleted: false }, // http://localhost:8386/api/v1/users?filter={"isDeleted":false}
                select: req.query.select || '',
                expand: req.query.expand || '',
            })
        }).send(res)
    }

    getStockCheckRequest = async (req, res) => {
        new OK({
            message: "Get stock check request successfully",
            metadata: await WarehouseService.getStockCheckRequest({
                id: req.params.id
            })
        }).send(res)
    }

    getAllStockCheckDetails = async (req, res) => {
        new OK({
            message: "Get all stock check details successfully",
            metadata: await WarehouseService.getAllStockCheckDetails({
                limit: req.query.limit || 10,
                sort: req.query.sort || 'ctime',
                page: req.query.page || 1,
                filter: req.query.filter ? JSON.parse(req.query.filter) : { isDeleted: false }, // http://localhost:8386/api/v1/users?filter={"isDeleted":false}
                select: req.query.select || '',
                expand: req.query.expand || '',
            })
        }).send(res)
    }

    getStockCheckDetail = async (req, res) => {
        new OK({
            message: "Get stock check detail successfully",
            metadata: await WarehouseService.getStockCheckDetail({
                id: req.params.id
            })
        }).send(res)
    }

    createStockCheckRequest = async (req, res, next, session) => {
        new CREATED({
            message: "Create stock check request successfully",
            metadata: await WarehouseService.createStockCheckRequest({
                ...req.body,
                session: session
            })
        }).send(res)
    }

    updateStockCheckRequest = async (req, res) => {
        new OK({
            message: "Update stock check request successfully",
            metadata: await WarehouseService.updateStockCheckRequest({
                id: req.params.id,
                ...req.body
            })
        }).send(res)
    }

    updateStockCheckDetail = async (req, res) => {
        new OK({
            message: "Update stock check detail successfully",
            metadata: await WarehouseService.updateStockCheckDetail({
                id: req.params.id,
                ...req.body
            })
        }).send(res)
    }

    deleteStockCheckRequest = async (req, res) => {
        new OK({
            message: "Delete stock check request successfully",
            metadata: await WarehouseService.deleteStockCheckRequest({
                id: req.params.id
            })
        }).send(res)
    }

    deleteStockCheckDetail = async (req, res) => {
        new OK({
            message: "Delete stock check detail successfully",
            metadata: await WarehouseService.deleteStockCheckDetail({
                id: req.params.id
            })
        }).send(res)
    }
}

module.exports = new WarehouseController()