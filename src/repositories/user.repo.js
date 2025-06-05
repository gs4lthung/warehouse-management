const { USER_ROLES } = require("../configs/user.config");
const inputModel = require("../models/input.model");
const outputModel = require("../models/output.model");
const stockCheckModel = require("../models/stockCheck.model");
const userModel = require("../models/user.model");
const warehouseCheckModel = require("../models/warehouseCheck.model");

const getAllUsers = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const users = await userModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(select)
        .lean();
    const totalUsers = await userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);
    return {
        users,
        page: page,
        totalPages: totalPages,
    };
}

const getInventoryStaffsByWorkload = async () => {
    const inputWorkload = await inputModel.aggregate([
        {
            $match: {
                status: "Assigned"
            }
        },
        {
            $unwind: "$inventoryStaffIds"
        },
        {
            $group: {
                _id: "$inventoryStaffIds",
                workload: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "Users",
                localField: "_id",
                foreignField: "_id",
                as: "inventoryStaff"
            }
        },
        {
            $unwind: "$inventoryStaff"
        },
        {
            $project: {
                _id: "$inventoryStaff._id",
                fullName: "$inventoryStaff.fullName",
                workload: 1
            }
        },
    ])

    const outputWorkload = await outputModel.aggregate([
        {
            $match: {
                status: "Assigned"
            }
        },
        {
            $unwind: "$inventoryStaffIds"
        },
        {
            $group: {
                _id: "$inventoryStaffIds",
                workload: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "Users",
                localField: "_id",
                foreignField: "_id",
                as: "inventoryStaff"
            }
        },
        {
            $unwind: "$inventoryStaff"
        },
        {
            $project: {
                _id: "$inventoryStaff._id",
                fullName: "$inventoryStaff.fullName",
                workload: 1
            }
        }
    ])

    const stockCheckWorkload = await stockCheckModel.aggregate([
        {
            $match: {
                status: "Pending"
            }
        },
        {
            $unwind: "$inventoryStaffIds"
        },
        {
            $group: {
                _id: "$inventoryStaffIds",
                workload: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "Users",
                localField: "_id",
                foreignField: "_id",
                as: "inventoryStaff"
            }
        },
        {
            $unwind: "$inventoryStaff"
        },
        {
            $project: {
                _id: "$inventoryStaff._id",
                fullName: "$inventoryStaff.fullName",
                workload: 1
            }
        }
    ])

    const warehouseCheckWorkload = await warehouseCheckModel.aggregate([
        {
            $match: {
                status: "Pending"
            }
        },
        {
            $unwind: "$inventoryStaffIds"
        },
        {
            $group: {
                _id: "$inventoryStaffIds",
                workload: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "Users",
                localField: "_id",
                foreignField: "_id",
                as: "inventoryStaff"
            }
        },
        {
            $unwind: "$inventoryStaff"
        },
        {
            $project: {
                _id: "$inventoryStaff._id",
                fullName: "$inventoryStaff.fullName",
                workload: 1
            }
        }
    ])

    const mergedWorkload = [...inputWorkload, ...outputWorkload, ...stockCheckWorkload, ...warehouseCheckWorkload].reduce((acc, curr) => {
        const existing = acc.find(item => item._id.toString() === curr._id.toString());
        if (existing) {
            existing.workload += curr.workload;
        } else {
            acc.push(curr);
        }
        return acc;
    }, []);

    mergedWorkload.sort((a, b) => a.workload - b.workload);

    return mergedWorkload;
}

module.exports = {
    getAllUsers,
    getInventoryStaffsByWorkload
}