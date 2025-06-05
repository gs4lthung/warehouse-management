const { notifyUser } = require("../../socket");
const { POPULATE_OUTPUT_DETAILS, POPULATE_OUTPUT } = require("../configs/output.config");
const { USER_ROLES } = require("../configs/user.config");
const { NotFoundRequestError, BadRequestError } = require("../core/responses/error.response");
const baseItemModel = require("../models/baseItem.model");
const itemModel = require("../models/item.model");
const outputModel = require("../models/output.model");
const outputDetailModel = require("../models/outputDetail.model");
const userModel = require("../models/user.model");
const warehouseStorageModel = require("../models/warehouseStorage.model");
const { getAllOutputRequests, getAllOutputDetails } = require("../repositories/output.repo");
const WarehouseService = require("./warehouse.service");

class OutputService {
    static getAllOutputRequests = async ({ limit, sort, page, filter, select, expand }) => {
        return await getAllOutputRequests({ limit, sort, page, filter, select, expand });
    }

    static getOutputRequest = async ({ id }) => {
        const outputHolder = await outputModel.findOne({
            _id: id,
        })
            .populate(POPULATE_OUTPUT)
            .lean();

        if (!outputHolder)
            throw new NotFoundRequestError("Output request not found");

        const outputDetailHolders = await outputDetailModel.find({ outputId: id })
            .populate([POPULATE_OUTPUT_DETAILS[1], POPULATE_OUTPUT_DETAILS[2], POPULATE_OUTPUT_DETAILS[3]])
            .lean();
        if (!outputDetailHolders || outputDetailHolders.length === 0)
            throw new NotFoundRequestError("Output details not found");

        return {
            output: outputHolder,
            outputDetails: outputDetailHolders
        };
    }

    static getAllOutputDetails = async ({ limit, sort, page, filter, select, expand }) => {
        return await getAllOutputDetails({ limit, sort, page, filter, select, expand });
    }

    static getOutputDetail = async ({ id }) => {
        const outputDetailHolder = await outputDetailModel.findOne({
            _id: id,
        }).
            populate(POPULATE_OUTPUT_DETAILS)
            .lean();

        if (!outputDetailHolder)
            throw new NotFoundRequestError("Output detail not found");

        return outputDetailHolder;
    }

    static updateOutputDetail = async ({ id, quantity, outputPrice, status, requesterId }) => {
        const outputDetailHolder = await outputDetailModel.findOne({
            _id: id,
        })
        if (!outputDetailHolder)
            throw new NotFoundRequestError("Output detail not found");
        if (outputDetailHolder.status === "Done")
            throw new BadRequestError("Output detail has been done");
        if (quantity && quantity < 0)
            throw new BadRequestError("Invalid quantity");
        if (outputPrice && outputPrice < 0)
            throw new BadRequestError("Invalid output price");
        if (status && !["Pending", "Done"].includes(status))
            throw new BadRequestError("Invalid status");
        if (requesterId) {
            const requesterHolder = await userModel.findOne({
                _id: requesterId,
                isDeleted: false
            }).lean();
            if (!requesterHolder)
                throw new NotFoundRequestError("Requester not found");
        }

        outputDetailHolder.quantity = quantity || outputDetailHolder.quantity;
        outputDetailHolder.outputPrice = outputPrice || outputDetailHolder.outputPrice;
        outputDetailHolder.status = status || outputDetailHolder.status;
        outputDetailHolder.updatedBy = requesterId || outputDetailHolder.updatedBy;
        await outputDetailHolder.save();


        return;
    }

    static createOuputRequest = async ({ reportStaffId, customerId, description, outputDetails, session }) => {
        console.log(reportStaffId, customerId, description, outputDetails)
        if (!reportStaffId || !customerId || !Array.isArray(outputDetails) || outputDetails.length === 0)
            throw new BadRequestError("Invalid input");

        const reportStaffHolder = await userModel.findOne({
            _id: reportStaffId,
            role: USER_ROLES.REPORT_STAFF,
            isDeleted: false
        }).lean();
        if (!reportStaffHolder)
            throw new NotFoundRequestError("Report staff not found");

        // Kiểm tra customer
        const customerHolder = await userModel.findOne({
            _id: customerId,
            role: USER_ROLES.CUSTOMER,
            isDeleted: false
        }).lean();
        if (!customerHolder)
            throw new NotFoundRequestError("Customer not found");

        // Tạo output request
        const now = new Date();
        const newOutput = await outputModel.create([{
            reportStaffId: reportStaffId,
            customerId: customerId,
            description: description || `Output request for ${customerHolder.name}`,
            status: "Pending",
            batchNumber: `${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}-OUP`
        }], { session: session });

        const outputDetailsToCreate = await Promise.all(outputDetails.map(async outputDetail => {
            const { itemId, quantity, outputPrice } = outputDetail;

            const itemHolder = await itemModel.findOne({
                _id: itemId,
                isDeleted: false
            }).lean();
            if (!itemHolder)
                throw new NotFoundRequestError("Item not found");

            const warehouseStorageHolder = await warehouseStorageModel.findOne({ itemId: itemId, isDeleted: false })
            if (!warehouseStorageHolder)
                throw new NotFoundRequestError("Warehouse storage not found");

            if (warehouseStorageHolder.quantity < quantity)
                throw new BadRequestError("Not enough quantity in warehouse");

            newOutput[0].totalPrice += outputPrice * quantity;

            return {
                outputId: newOutput[0]._id,
                warehouseId: warehouseStorageHolder.warehouseId,
                itemId: itemId,
                quantity: quantity,
                outputPrice: outputPrice,
            }
        }));
        await newOutput[0].save({ session: session });
        await outputDetailModel.insertMany(outputDetailsToCreate.flat(), { session: session });
        await notifyUser({ userId: customerId, task: `Your output request has been created`, navigatePage: "inventoryrequestcustomer", type: "info" });
        await notifyUser({ userId: reportStaffId, task: `You have created a new output request`, navigatePage: "reportstaffoutputrequest", type: "success" });
        const managerHolder = await userModel.findOne({ role: USER_ROLES.MANAGER, isDeleted: false }).lean();
        await notifyUser({ userId: managerHolder._id, task: `You have a new output request`, navigatePage: "listOutputRequestManager", type: "info" });
        return newOutput[0];
    }

    static updateOutputRequest = async ({ id, description, fromDate, toDate, inventoryStaffIds }) => {
        if (!id || (inventoryStaffIds && (!Array.isArray(inventoryStaffIds) || inventoryStaffIds.length === 0)))
            throw new BadRequestError("Invalid input");

        const outputHolder = await outputModel.findOne({
            _id: id,
            status: ["Pending", "Approved", "Assigned"],
            isDeleted: false
        })
        if (!outputHolder)
            throw new NotFoundRequestError("Output request not found");

        if (fromDate && toDate && fromDate > toDate)
            throw new BadRequestError("Invalid date range");

        if (fromDate && toDate && fromDate < new Date().getTime())
            throw new BadRequestError("Invalid date range");

        if (inventoryStaffIds) {
            const inventoryStaffHolders = await userModel.find({
                _id: { $in: inventoryStaffIds },
                role: USER_ROLES.INVENTORY_STAFF,
                isDeleted: false
            })
            if (!inventoryStaffHolders || inventoryStaffHolders.length === 0)
                throw new NotFoundRequestError("Inventory staffs not found");
            outputHolder.inventoryStaffIds = inventoryStaffIds
        }

        outputHolder.description = description || outputHolder.description;
        outputHolder.fromDate = fromDate || outputHolder.fromDate;
        outputHolder.toDate = toDate || outputHolder.toDate;
        await outputHolder.save();

        if (inventoryStaffIds)
            for (let inventoryStaffId of outputHolder.inventoryStaffIds) {
                await notifyUser({
                    userId: inventoryStaffId,
                    task: `You have assigned to an output request`,
                    navigatePage: "outputitemcheck",
                    type: "info"
                });
            }

        return;
    }

    static approveOutputRequest = async ({ id, managerId }) => {
        if (!id || !managerId)
            throw new BadRequestError("Invalid input");

        const outputHolder = await outputModel.findOne({
            _id: id,
            status: "Pending",
            isDeleted: false
        })
        if (!outputHolder)
            throw new NotFoundRequestError("Output request not found");

        const managerHolder = await userModel.findOne({
            _id: managerId,
            role: USER_ROLES.MANAGER,
            isDeleted: false
        }).lean();

        if (!managerHolder)
            throw new NotFoundRequestError("Manager not found");

        outputHolder.status = "Approved";
        outputHolder.managerId = managerId;
        await outputHolder.save();

        await notifyUser({
            userId: outputHolder.customerId,
            task: `Your output request has been approved`,
            navigatePage: "inventoryrequestcustomer",
            type: "success"
        })

        return;
    }

    static assignOutputRequest = async ({ id, fromDate, toDate, inventoryStaffIds }) => {
        if (!id || !Array.isArray(inventoryStaffIds) || inventoryStaffIds.length === 0)
            throw new BadRequestError("Invalid input");
        if (fromDate && toDate && fromDate > toDate)
            throw new BadRequestError("Invalid date range");
        if (fromDate && toDate && fromDate < new Date().getTime())
            throw new BadRequestError("Invalid date range");

        const outputHolder = await outputModel.findOne({
            _id: id,
            status: "Approved",
            isDeleted: false
        })
        if (!outputHolder)
            throw new NotFoundRequestError("Output request not found");

        const inventoryStaffHolders = await userModel.find({
            _id: { $in: inventoryStaffIds },
            role: USER_ROLES.INVENTORY_STAFF,
            isDeleted: false
        })
        if (!inventoryStaffHolders || inventoryStaffHolders.length === 0)
            throw new NotFoundRequestError("Inventory staffs not found");


        outputHolder.status = "Assigned";
        outputHolder.inventoryStaffIds = inventoryStaffIds;
        outputHolder.fromDate = fromDate;
        outputHolder.toDate = toDate;
        await outputHolder.save();

        for (let inventoryStaffId of inventoryStaffIds) {
            await notifyUser({
                userId: inventoryStaffId,
                task: `You have assigned to an output request`,
                navigatePage: "outputitemcheck",
                type: "info"
            });
        }
        return;
    }

    static completeOutputRequest = async ({ id, session }) => {
        if (!id)
            throw new BadRequestError("Invalid input");

        const outputHolder = await outputModel.findOne({
            _id: id,
            status: "Assigned",
            isDeleted: false
        })
        if (!outputHolder)
            throw new NotFoundRequestError("Output request not found");

        const outputDetailHolders = await outputDetailModel.find({ outputId: id }).lean();
        if (!outputDetailHolders || outputDetailHolders.length === 0)
            throw new NotFoundRequestError("Output details not found");

        for (let outputDetail of outputDetailHolders) {
            await WarehouseService.handleStorageTransaction({
                outputId: outputHolder._id,
                itemId: outputDetail.itemId,
                warehouseId: outputDetail.warehouseId,
                quantity: outputDetail.quantity,
                transactionType: "Output",
                description: `Output request ${outputHolder.batchNumber}`,
                session: session
            })
        }

        outputHolder.status = "Done";
        await outputHolder.save();

        await notifyUser({
            userId: outputHolder.customerId,
            task: `Your output request has been completed`,
            navigatePage: "inventoryrequestcustomer",
            type: "success"
        })
        return;
    }

    static cancelOutputRequest = async ({ id, cancelReason }) => {
        if (!id || !cancelReason)
            throw new BadRequestError("Invalid input");

        const outputHolder = await outputModel.findOne({
            _id: id,
            status: { $in: ["Pending", "Approved"] },
            isDeleted: false
        })
        if (!outputHolder)
            throw new NotFoundRequestError("Output request not found");

        outputHolder.status = "Cancelled";
        outputHolder.cancelReason = cancelReason;
        await outputHolder.save();

        await notifyUser({
            userId: outputHolder.customerId,
            task: `Your output request has been cancelled`,
            navigatePage: "inventoryrequestcustomer",
            type: "error"
        })

        return;
    }

    static checkOutputRequestDate = async () => {
        const outputHolders = await outputModel.find({ status: "Pending", isDeleted: false })
        const currentDate = new Date();

        const outputRequests = outputHolders.filter(output => output.toDate < currentDate);
        if (outputRequests.length === 0)
            return outputRequests;

        for (const outputRequest of outputRequests) {
            await outputModel.updateOne({ _id: outputRequest._id }, {
                status: "Cancelled",
                cancelReason: "Exceeding deadline"
            })
            await notifyUser({
                userId: outputHolders.customerId,
                task: `Your output request has been cancelled`,
                navigatePage: "inventoryrequestcustomer",
                type: "error"
            })
        }

        if (outputRequests.length > 0) {
            const managerHolder = await userModel.findOne({ role: USER_ROLES.MANAGER, isDeleted: false }).lean();
            await notifyUser({
                userId: managerHolder._id,
                task: `You have output requests not done exceeding the deadline`,
                navigatePage: "listOutputRequestManager",
                type: "error"
            })
        }

        return outputRequests;
    }
}



module.exports = OutputService;