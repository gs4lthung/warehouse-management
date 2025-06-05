const { SELECT_BASEITEM } = require("../configs/baseitem.config");
const inputDetailModel = require("../models/inputDetail.model");
const itemModel = require("../models/item.model");
const systemModel = require("../models/system.model");
const warehouseStorageModel = require("../models/warehouseStorage.model");

const getAllItems = async ({ limit, sort, page, filter, select, expand }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

    const populateOptions = {
        baseItem: { path: 'baseItemId', select: SELECT_BASEITEM.DEFAULT }
    };

    const populateFields = expand
        ? expand.split(" ").map(field => populateOptions[field]).filter(Boolean)
        : [];

    const items = await itemModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(select)
        .populate(populateFields)
        .lean();

    if (items.length === 0) {
        return {
            items: [],
            page: Number(page),
            totalPages: 0,
        };
    }

    const itemIds = items.map(item => item._id);

    const warehouseStorageData = await warehouseStorageModel.find({ itemId: { $in: itemIds } }).lean();
    const warehouseStorageMap = warehouseStorageData.reduce((acc, storage) => {
        acc[storage.itemId.toString()] = storage.quantity;
        return acc;
    }, {});

    const inputDetailData = await inputDetailModel.find({ itemId: { $in: itemIds } }).lean();
    const inputDetailMap = inputDetailData.reduce((acc, detail) => {
        acc[detail.itemId.toString()] = detail.suggestedOutputPrice;
        return acc;
    }, {});

    for (let item of items) {
        item.storageQuantity = warehouseStorageMap[item._id.toString()] || 0;
        item.suggestedOutputPrice = inputDetailMap[item._id.toString()] || 0;
    }

    const totalItems = await itemModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    return {
        items,
        page: Number(page),
        totalPages: totalPages,
    };
};


const checkExpiredMedicines = async () => {
    const system = await systemModel.findOne({});
    const expiredThreshold = new Date(new Date().getTime() - system.expiredMedicineDate)

    let expiredMedicines = await itemModel.aggregate([
        {
            $match: {
                expiredDate: { $exists: true, $ne: null, $lt: expiredThreshold },
                status: { $in: ["Available", "Almost Expired"] }
            }
        },
        {
            $lookup: {
                from: 'BaseItems',
                localField: 'baseItemId',
                foreignField: '_id',
                as: 'baseItem'
            }
        },
        {
            $unwind: '$baseItem'
        },
        {
            $match: {
                'baseItem.category': 'Medicine'
            }
        }
    ]);

    if (expiredMedicines.length > 0) {
        await itemModel.updateMany(
            { _id: { $in: expiredMedicines.map(medicine => medicine._id) } },
            { $set: { status: "Expired" } }
        );

        expiredMedicines = expiredMedicines.map(medicine => ({
            ...medicine,
            status: "Expired"
        }));
    }

    return expiredMedicines;
};


const checkAlmostExpiredMedicines = async () => {
    const system = await systemModel.findOne({})

    let almostExpiredMedicines = await itemModel.aggregate([
        {
            $match: {
                expiredDate: { $exists: true, $ne: null, $lt: new Date(new Date().getTime() - system.almostExpiredMedicineDate) },
                status: "Available"
            }
        },
        {
            $lookup: {
                from: 'BaseItems',
                localField: 'baseItemId',
                foreignField: '_id',
                as: 'baseItem'
            }
        },
        {
            $unwind: '$baseItem'
        }, {
            $match: {
                'baseItem.category': 'Medicine'
            }
        }
    ])

    await itemModel.updateMany({ _id: { $in: almostExpiredMedicines.map(medicine => medicine._id) } },
        { status: "Almost Expired" })

    await inputDetailModel.updateMany({ itemId: { $in: almostExpiredMedicines.map(medicine => medicine._id) } },
        [{ $set: { suggestedOutputPrice: { $multiply: ["$inputPrice", system.almostExpiredOutputPricePercentage] } } }])


    for (let medicine of almostExpiredMedicines) {
        medicine.status = "Almost Expired"
    }

    return almostExpiredMedicines
}

module.exports = { getAllItems, checkExpiredMedicines, checkAlmostExpiredMedicines };