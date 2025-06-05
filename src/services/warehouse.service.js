const stockTransactionModel = require("../models/stockTransaction.model")
const warehouseCheckModel = require("../models/warehouseCheck.model")
const warehouseStorageModel = require("../models/warehouseStorage.model")
const { getAllWarehouses, getAllWarehouseChecks, getAllWarehouseStorages } = require("../repositories/warehouse.repo")
const { NotFoundRequestError, BadRequestError } = require("../core/responses/error.response");
const userModel = require("../models/user.model");
const warehouseModel = require("../models/warehouse.model");
const stockCheckModel = require("../models/stockCheck.model");
const inputModel = require("../models/input.model")
const inputDetailModel = require("../models/inputDetail.model")
const {
    getAllStockCheckRequests,
    getAllStockCheckDetails,
    getAllStockTransactions
} = require("../repositories/warehouse.repo");
const itemModel = require("../models/item.model");
const stockCheckDetailModel = require("../models/stockCheckDetail.model");
const outputModel = require("../models/output.model");
const outputDetailModel = require("../models/outputDetail.model");
const {
    POPULATE_WAREHOUSE_STORAGES,
    POPULATE_STOCK_DETAILS,
    POPULATE_STOCK_TRANSACTIONS,
    POPULATE_WAREHOUSE_CHECK
} = require("../configs/warehouse.config");
const { USER_ROLES } = require("../configs/user.config");
const { eventEmitter, notifyUser } = require("../../socket");

class WarehouseService {
    static getAllWarehouses = async ({ limit, sort, page, filter, select }) => {
        return await getAllWarehouses({ limit, sort, page, filter, select })
    }

    static getWarehouse = async ({ id }) => {
        const warehouseHolder = await warehouseModel.findOne({ _id: id }).lean()
        if (!warehouseHolder) {
            throw new NotFoundRequestError('Warehouse not found')
        }

        return warehouseHolder
    }

    static updateWarehouse = async ({ id, name, description, category, minTemperature, maxTemperature }) => {
        const warehouseHolder = await warehouseModel.findOne({ _id: id, isDeleted: false }).lean()
        if (!warehouseHolder) {
            throw new NotFoundRequestError('Warehouse not found')
        }

        const updatedWarehouse = await warehouseModel.findOneAndUpdate({ _id: id }, {
            name: name || warehouseHolder.name,
            description: description || warehouseHolder.description,
            category: category || warehouseHolder.category,
            minTemperature: minTemperature || warehouseHolder.minTemperature,
            maxTemperature: maxTemperature || warehouseHolder.maxTemperature
        }, { new: true })

        return
    }

    static deleteWarehouse = async ({ id }) => {
        const warehouseHolder = await warehouseModel.findOne({ _id: id, isDeleted: false }).lean()
        if (!warehouseHolder) {
            throw new NotFoundRequestError('Warehouse not found')
        }

        await warehouseModel.findOneAndUpdate({ _id: id }, {
            isDeleted: true
        }, { new: true })

        return
    }

    static getAllWarehouseChecks = async ({ limit, sort, page, filter, select, expand }) => {
        return await getAllWarehouseChecks({ limit, sort, page, filter, select, expand })
    }

    static getWarehouseCheck = async ({ id }) => {
        const warehouseCheckHolder = await warehouseCheckModel.findOne({ _id: id })
            .populate(POPULATE_WAREHOUSE_CHECK)
            .lean()
        if (!warehouseCheckHolder) {
            throw new NotFoundRequestError('Warehouse check not found')
        }

        return {
            warehouseCheck: warehouseCheckHolder,
        }

    }

    static createWarehouseCheck = async ({ warehouseId, managerId, inventoryStaffIds, description, fromDate, toDate }) => {
        if (!warehouseId || !managerId || !inventoryStaffIds || inventoryStaffIds.length === 0 || !Array.isArray(inventoryStaffIds)) {
            throw new BadRequestError('Invalid input')
        }

        if (fromDate >= toDate || fromDate < new Date()) {
            throw new BadRequestError('Invalid date range')
        }

        const warehouseHolder = await warehouseModel.findOne({ _id: warehouseId, isDeleted: false }).lean()
        if (!warehouseHolder) {
            throw new NotFoundRequestError('Warehouse not found')
        }

        const managerHolder = await userModel.findOne({ _id: managerId, isDeleted: false }).lean()
        if (!managerHolder) {
            throw new NotFoundRequestError('Manager not found')
        }

        const inventoryStaffHolders = await userModel.find({ _id: { $in: inventoryStaffIds }, isDeleted: false }).lean()
        if (!inventoryStaffHolders) {
            throw new NotFoundRequestError('Inventory staff not found')
        }

        const newWarehouseCheck = await warehouseCheckModel.create({
            warehouseId,
            managerId,
            inventoryStaffIds,
            description: description || `Check for ${warehouseHolder.name}`,
            status: 'Pending',
            fromDate,
            toDate
        })

        return newWarehouseCheck
    }

    static updateWarehouseCheck = async ({ id, description, temperature, thresholdLevel, condition, status, inventoryStaffIds }) => {
        if (inventoryStaffIds && inventoryStaffIds.length === 0) {
            throw new BadRequestError('Invalid input')
        }

        const warehouseCheckHolder = await warehouseCheckModel.findOne({ _id: id, isDeleted: false, status: { $ne: "Cancelled" } }).lean()
        if (!warehouseCheckHolder) {
            throw new NotFoundRequestError('Warehouse check not found')
        }

        await warehouseCheckModel.findOneAndUpdate({ _id: id }, {
            description: description || warehouseCheckHolder.description,
            temperature: temperature || warehouseCheckHolder.temperature,
            thresholdLevel: thresholdLevel || warehouseCheckHolder.thresholdLevel,
            condition: condition || warehouseCheckHolder.condition,
            status: status || warehouseCheckHolder.status,
            inventoryStaffIds: inventoryStaffIds || warehouseCheckHolder.inventoryStaffIds
        }, { new: true })

        return
    }

    static deleteWarehouseCheck = async ({ id }) => {
        const warehouseCheckHolder = await warehouseCheckModel.findOne({ _id: id, isDeleted: false }).lean()
        if (!warehouseCheckHolder) {
            throw new NotFoundRequestError('Warehouse check not found')
        }

        const updatedWarehouseCheck = await warehouseCheckModel.findOneAndUpdate({ _id: id }, {
            isDeleted: true
        }, { new: true })

        return
    }

    static getAllWarehouseStorages = async ({ limit, sort, page, filter, select, expand }) => {
        return await getAllWarehouseStorages({ limit, sort, page, filter, select, expand });
    }

    static getWarehouseStorage = async ({ id }) => {
        const warehouseStorageHolder = await warehouseStorageModel.findOne({ _id: id })
            .populate(POPULATE_WAREHOUSE_STORAGES)
            .lean();
        if (!warehouseStorageHolder) {
            throw new NotFoundRequestError("Warehouse Storage not found");
        }

        return warehouseStorageHolder;
    }

    static deleteWarehouseStorage = async ({ id }) => {
        const warehouseStorageHolder = await warehouseStorageModel.findOne({ _id: id, isDeleted: false }).lean();
        if (!warehouseStorageHolder) {
            throw new NotFoundRequestError("Warehouse storage not found");
        }

        if (warehouseStorageHolder.quantity > 0) {
            throw new BadRequestError("Warehouse storage must be empty before deleting");
        }

        await warehouseStorageModel.updateOne({ _id: id }, { isDeleted: true })

        return
    }

    static getAllStockTransactions = async ({ limit, sort, page, filter, select, expand }) => {
        return await getAllStockTransactions({ limit, sort, page, filter, select, expand });
    }

    static getStockTransaction = async ({ id }) => {
        const stockTransactionHolder = await stockTransactionModel.findOne({ _id: id })
            .populate(POPULATE_STOCK_TRANSACTIONS)
            .lean();

        if (!stockTransactionHolder) {
            throw new NotFoundRequestError("Stock transaction not found");
        }

        return stockTransactionHolder;

    }


    static handleStorageTransaction = async ({
        inputId,
        outputId,
        warehouseId,
        itemId,
        quantity,
        transactionType,
        description,
        session
    }) => {
        const warehouseHolder = await warehouseModel.findOne({ _id: warehouseId, isDeleted: false }).lean();
        if (!warehouseHolder) {
            throw new NotFoundRequestError("Warehouse not found");
        }

        const itemHolder = await itemModel.findOne({ _id: itemId, isDeleted: false })
        if (!itemHolder) {
            throw new NotFoundRequestError("Item not found");
        }

        if (quantity < 0) {
            throw new BadRequestError("Quantity must be greater than 0");
        }

        switch (transactionType) {
            case "Input":
                if (!itemHolder.manufactureDate || !itemHolder.expiredDate) {
                    throw new BadRequestError("Manufacture date and expired date is required");
                }

                if (!inputId) {
                    throw new BadRequestError("Input id is required");
                }
                const inputHolder = await inputModel.findOne({ _id: inputId, isDeleted: false }).lean();
                if (!inputHolder) {
                    throw new BadRequestError("Input not found");
                }

                const inputDetailHolders = await inputDetailModel.find({
                    inputId: inputHolder._id,
                    isDeleted: false
                }).lean();

                const inputItemIds = inputDetailHolders.map(inputDetail => inputDetail.itemId.toString());

                if (!inputItemIds.includes(itemId.toString())) {
                    throw new BadRequestError("Item not found in input");
                }

                for (let inputDetail of inputDetailHolders) {
                    inputHolder.totalPrice += inputDetail.inputPrice
                }

                const inputDetailHolder = inputDetailHolders.find(inputDetail => inputDetail.itemId.toString() === itemId.toString());

                if (!inputDetailHolder.actualQuantity || inputDetailHolder.actualQuantity !== quantity) {
                    throw new BadRequestError("Quantity not match input quantity");
                }

                await inputDetailModel.updateOne({ _id: inputDetailHolder._id }, { status: "Done" }, { session: session })

                const now = new Date();
                await warehouseStorageModel.create([{
                    warehouseId,
                    itemId,
                    quantity,
                    batchNumber: `${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}-STR-${(Math.floor(Math.random() * 1000) + 1)}`,
                }], { session: session })

                itemHolder.status = "Available";
                await itemHolder.save({ session: session });

                break

            case "Output":
                if (!outputId) {
                    throw new BadRequestError("Output id is required");
                }
                const outputHolder = await outputModel.findOne({ _id: outputId, isDeleted: false }).lean();
                if (!outputHolder) {
                    throw new BadRequestError("Output not found");
                }

                const outputDetailHolders = await outputDetailModel.find({
                    outputId: outputHolder._id,
                    isDeleted: false
                }).lean();
                const outputItemIds = outputDetailHolders.map(outputDetail => outputDetail.itemId.toString());

                if (!outputItemIds.includes(itemId.toString())) {
                    throw new BadRequestError("Item not found in output");
                }

                const outputDetailHolder = outputDetailHolders.find(outputDetail => outputDetail.itemId.toString() === itemId.toString());
                if (outputDetailHolder.status === "Done") {
                    throw new BadRequestError("Output detail already done");
                }

                if (outputDetailHolder.quantity !== quantity) {
                    throw new BadRequestError("Quantity not match output quantity");
                }

                await outputDetailModel.updateOne({ _id: outputDetailHolder._id }, { status: "Done" }, { session: session })

                const warehouseStorageHolder = await warehouseStorageModel.findOne({
                    warehouseId: warehouseId,
                    itemId: itemId,
                    isDeleted: false
                })
                if (!warehouseStorageHolder) {
                    throw new NotFoundRequestError("Warehouse storage not found");
                }

                warehouseStorageHolder.quantity -= quantity;
                if (warehouseStorageHolder.quantity < 0) {
                    throw new BadRequestError("Not enough quantity in warehouse storage");
                }
                if (warehouseStorageHolder.quantity === 0) {
                    warehouseStorageHolder.isDeleted = true;
                    itemHolder.isDeleted = true;
                }
                await warehouseStorageHolder.save();
                await itemHolder.save();
                break;
            default:
                throw new BadRequestError("Invalid transaction type");
        }


        await stockTransactionModel.create({
            warehouseId,
            itemId,
            quantity,
            transactionType,
            description: description || `Warehouse storage ${transactionType} for ${warehouseHolder.name}`
        })

        return
    }

    static getAllStockCheckRequests = async ({ limit, sort, page, filter, select, expand }) => {
        return await getAllStockCheckRequests({ limit, sort, page, filter, select, expand });
    }

    static getStockCheckRequest = async ({ id }) => {
        const stockCheckHolder = await stockCheckModel.findOne({ _id: id })
            .lean();

        if (!stockCheckHolder) {
            throw new NotFoundRequestError("Stock check request not found");
        }

        const stockCheckDetailHolders = await stockCheckDetailModel.find({ stockCheckId: id })
            .populate(POPULATE_STOCK_DETAILS)
            .lean();

        return {
            stockCheck: stockCheckHolder,
            stockCheckDetails: stockCheckDetailHolders
        };
    }

    static getAllStockCheckDetails = async ({ limit, sort, page, filter, select, expand }) => {
        return await getAllStockCheckDetails({ limit, sort, page, filter, select, expand })
    }

    static getStockCheckDetail = async ({ id }) => {
        return await stockCheckDetailModel.findOne({ _id: id })
            .populate(POPULATE_STOCK_DETAILS)
            .lean();
    }

    static createStockCheckRequest = async ({
        description,
        warehouseId,
        managerId,
        inventoryStaffIds,
        fromDate,
        toDate,
        session
    }) => {
        const warehouseHolder = await warehouseModel.findOne({ _id: warehouseId, isDeleted: false }).lean();
        if (!warehouseHolder) {
            throw new NotFoundRequestError("Warehouse not found");
        }

        const managerIdHolder = await userModel.findOne({ _id: managerId, role: "Manager", isDeleted: false }).lean();
        if (!managerIdHolder) {
            throw new NotFoundRequestError("Manager not found");
        }

        const inventoryStaffIdHolders = await userModel.find({
            _id: { $in: inventoryStaffIds },
            role: USER_ROLES.INVENTORY_STAFF,
            isDeleted: false
        }).lean();
        if (!inventoryStaffIdHolders) {
            throw new NotFoundRequestError("Inventory Staff not found");
        }

        if (!description) {
            description = `Stock check for ${warehouseHolder.name}`
        }

        if (fromDate >= toDate || fromDate < new Date()) {
            throw new BadRequestError("Invalid date range");
        }

        const newStockCheck = await stockCheckModel.create([{
            description,
            warehouseId,
            managerId,
            inventoryStaffIds,
            fromDate,
            toDate,
        }], { session: session })

        const warehouseStorageHolders = await warehouseStorageModel
            .find({ warehouseId: warehouseId, isDeleted: false })
            .lean();

        const stockCheckDetailsToCreate = warehouseStorageHolders.map(warehouseStorage => {
            return {
                stockCheckId: newStockCheck[0]._id,
                itemId: warehouseStorage.itemId,
                systemQuantity: warehouseStorage.quantity,
                description: `Check for ${warehouseHolder.name}`,
                status: "Pending"
            }
        })
        if (stockCheckDetailsToCreate.length === 0) {
            throw new BadRequestError("Warehouse storage is empty");
        }
        await stockCheckDetailModel.insertMany(stockCheckDetailsToCreate)

        return newStockCheck[0]
    }

    static checkWarehouseCheckDate = async () => {
        const warehouseCheckHolders = await warehouseCheckModel.find({ status: "Pending", isDeleted: false })
        const currentDate = new Date();

        const warehouseChecks = warehouseCheckHolders.filter(warehouseCheck => warehouseCheck.toDate < currentDate);

        for (const warehouseCheck of warehouseChecks) {
            await warehouseCheckModel.updateOne({ _id: warehouseCheck._id }, {
                status: "Cancelled",
                condition: "Exceeding deadline"
            })

            for (const inventoryStaff of warehouseCheck.inventoryStaffIds) {
                await notifyUser({
                    userId: inventoryStaff,
                    task: "Your warehouse check has been cancelled due to exceeding deadline",
                    navigatePage: "/",
                    type: "error"
                })
            }
        }

        const managerHolder = await userModel.findOne({
            role: USER_ROLES.MANAGER,
            isDeleted: false
        })

        if (warehouseChecks.length > 0)
            await notifyUser({
                userId: managerHolder._id,
                task: `Found ${warehouseChecks.length} warehouse checks not done exceeding the deadline`,
                navigatePage: "/warehousecheck",
                type: "error"
            })
    }

    static checkStockRequestDate = async () => {
        const stockCheckHolders = await stockCheckModel.find({ status: "Pending", isDeleted: false })
        const currentDate = new Date();

        const stockRequests = stockCheckHolders.filter(stockCheck => stockCheck.toDate < currentDate);

        for (const stockRequest of stockRequests) {
            await stockCheckModel.updateOne({ _id: stockRequest._id }, {
                status: "Cancelled",
                cancelReason: "Exceeding deadline"
            })

            for (const inventoryStaff of stockRequest.inventoryStaffIds) {
                await notifyUser({
                    userId: inventoryStaff,
                    task: "Your stock check request has been cancelled due to exceeding deadline",
                    navigatePage: "/",
                    type: "error"
                })
            }
        }

        const managerHolder = await userModel.findOne({
            role: USER_ROLES.MANAGER,
            isDeleted: false
        })

        if (stockRequests.length > 0)
            await notifyUser({
                userId: managerHolder._id,
                task: `Found ${stockRequests.length} stock check requests not done exceeding the deadline`,
                navigatePage: "/stockcheckrequest",
                type: "error"
            })

        return stockRequests;
    }

    static updateStockCheckRequest = async ({ id, description, status, fromDate, toDate, cancelReason }) => {
        const stockCheckHolder = await stockCheckModel
            .findOne({
                _id: id,
                isDeleted: false
            })
        if (!stockCheckHolder) {
            throw new NotFoundRequestError("Stock check request not found");
        }

        if (stockCheckHolder.status === "Done") {
            throw new BadRequestError("Stock check request already done");
        }

        if (stockCheckHolder.status === "Cancelled") {
            throw new BadRequestError("Stock check request already cancelled");
        }

        if (fromDate >= toDate || fromDate < new Date()) {
            throw new BadRequestError("Invalid date range");
        }

        if (status === "Cancelled") {
            if (!cancelReason)
                throw new BadRequestError("Cancel reason is required");

            await stockCheckModel.updateOne({ _id: id }, {
                status: status,
                cancelReason: cancelReason

            })
            return
        }

        if (status === "Done") {
            const stockCheckDetailHolders = await stockCheckDetailModel
                .find({
                    stockCheckId: id,
                    isDeleted: false
                })
                .lean();

            for (const stockCheckDetail of stockCheckDetailHolders) {
                if (stockCheckDetail.status === "Pending") {
                    throw new BadRequestError("All stock check details must be done before request");
                }
            }
        }

        stockCheckHolder.status = status || stockCheckHolder.status
        stockCheckHolder.description = description || stockCheckHolder.description
        stockCheckHolder.fromDate = fromDate || stockCheckHolder.fromDate
        stockCheckHolder.toDate = toDate || stockCheckHolder.toDate
        await stockCheckHolder.save()

        return
    }

    static updateStockCheckDetail = async ({ id, actualQuantity, description, status }) => {
        if (actualQuantity && actualQuantity < 0) {
            throw new BadRequestError("Quantity must be greater than 0");
        }

        const stockCheckDetailHolder = await stockCheckDetailModel
            .findOne({
                _id: id,
                isDeleted: false
            })
        if (!stockCheckDetailHolder) {
            throw new NotFoundRequestError("Stock check detail not found");
        }
        if (stockCheckDetailHolder.status === "Done") {
            throw new BadRequestError("Stock check detail already done");
        }

        if (actualQuantity) {
            stockCheckDetailHolder.difference = actualQuantity - stockCheckDetailHolder.systemQuantity;
        }

        stockCheckDetailHolder.actualQuantity = actualQuantity || stockCheckDetailHolder.actualQuantity
        stockCheckDetailHolder.description = description || stockCheckDetailHolder.description
        stockCheckDetailHolder.status = status || stockCheckDetailHolder.status
        await stockCheckDetailHolder.save()

        return
    }

    static deleteStockCheckRequest = async ({ id }) => {
        const stockCheckHolder = await stockCheckModel
            .findOne({
                _id: id,
                isDeleted: false
            })
        if (!stockCheckHolder) {
            throw new NotFoundRequestError("Stock check request not found");
        }

        if (stockCheckHolder.status === "Done") {
            throw new BadRequestError("Stock check request already done");
        }

        if (stockCheckHolder.status === "Cancelled") {
            throw new BadRequestError("Stock check request already cancelled");
        }

        await stockCheckDetailModel.updateMany({ stockCheckId: id }, { isDeleted: true })

        stockCheckHolder.isDeleted = true
        await stockCheckHolder.save()

        return
    }

    static deleteStockCheckDetail = async ({ id }) => {
        const stockCheckDetailHolder = await stockCheckDetailModel
            .findOne({
                _id: id,
                isDeleted: false
            })
        if (!stockCheckDetailHolder) {
            throw new NotFoundRequestError("Stock check detail not found");
        }
        if (stockCheckDetailHolder.status === "Done") {
            throw new BadRequestError("Stock check detail already done");
        }

        stockCheckDetailHolder.isDeleted = true
        await stockCheckDetailHolder.save()

        return
    }

}

module.exports = WarehouseService