const cron = require("node-cron");
const getLogger = require("../utils/logger");
const ItemService = require("../services/item.service");
const systemModel = require("../models/system.model");
const WarehouseService = require("../services/warehouse.service");
const OutputService = require("../services/output.service");
const logger = getLogger("CRON_JOB");

const CRON_INTERVAL = {
    MINUTELY: "* * * * *",
    HOURLY: "0 * * * *",
    DAILY: "0 0 * * *",
    WEEKLY: "0 0 * * 0",
    MONTHLY: "0 0 1 * *"
}

const cronJobs = {
    checkExpiredMedicine: {
        name: "Check medicines condition",
        interval: CRON_INTERVAL.HOURLY, // Every day at 00:00
        task: null,
        callback: async () => {
            try {
                const medicines = await ItemService.checkMedicinesCondition();
                if (medicines.almostExpiredMedicines > 0)
                    logger.info(`🕒 Found ${medicines.almostExpiredMedicines} almost expired medicines`);
                if (medicines.expiredMedicines > 0)
                    logger.info(`🕒 Found ${medicines.expiredMedicines} expired medicines`);
            } catch (error) {
                logger.error("❌ Error checking medicines condition", error);
            }
        }
    },
    checkStockRequestDateInterval: {
        name: "Check stock request date",
        interval: CRON_INTERVAL.HOURLY, // Every day at 00:00
        task: null,
        callback: async () => {
            try {
                const stockRequests = await WarehouseService.checkStockRequestDate();
                if (stockRequests?.length > 0)
                    logger.info(`🕒 Found ${stockRequests.length} stock requests not done exceeding the deadline`);
            } catch (error) {
                logger.error("❌ Error checking stock request date", error);
            }
        }
    },
    checkWarehouseCheckDateInterval: {
        name: "Check warehouse check date",
        interval: CRON_INTERVAL.HOURLY,
        task: null,
        callback: async () => {
            try {
                const warehouseChecks = await WarehouseService.checkWarehouseCheckDate();
                if (warehouseChecks?.length > 0)
                    logger.info(`🕒 Found ${warehouseChecks.length} warehouse checks not done exceeding the deadline`);
            } catch (error) {
                logger.error("❌ Error checking warehouse check date", error);
            }
        }
    },
    checkOutputRequestDateInterval: {
        name: "Check output request date",
        interval: CRON_INTERVAL.HOURLY,
        task: null,
        callback: async () => {
            try {
                const outputRequests = await OutputService.checkOutputRequestDate();
                if (outputRequests?.length > 0)
                    logger.info(`🕒 Found ${outputRequests?.length} output requests not done exceeding the deadline`);
            } catch (error) {
                logger.error("❌ Error checking output request date", error);
            }
        }
    }

}
const startCronJobs = () => {
    Object.keys(cronJobs).forEach(async (job) => {
        if (cronJobs[job].task) {
            logger.info(`🕒 ${cronJobs[job].name} is already running, stopping...`);
            cronJobs[job].task.stop();
        }

        const system = await systemModel.findOne();

        switch (job) {
            case "checkExpiredMedicine":
                cronJobs[job].interval = system.checkMedicinesConditionInterval;
                break;
            case "checkStockRequestDateInterval":
                cronJobs[job].interval = system.checkStockRequestDateInterval;
                break;
            case "checkWarehouseCheckDateInterval":
                cronJobs[job].interval = system.checkWarehouseCheckDateInterval;
                break;
            case "checkOutputRequestDateInterval":
                cronJobs[job].interval = system.checkOutputRequestDateInterval;
                break;
        }

        let interval = ""
        switch (cronJobs[job].interval) {
            case "* * * * *":
                interval = "Every minute";
                break;
            case "0 * * * *":
                interval = "Every hour";
                break;
            case "0 0 * * *":
                interval = "Every day";
                break;
            case "0 0 * * 0":
                interval = "Every week";
                break;
            case "0 0 1 * *":
                interval = "Every month";
                break;
            default:
                interval = cronJobs[job].interval;
                break;
        }

        cronJobs[job].task = cron.schedule(cronJobs[job].interval, cronJobs[job].callback);
        logger.info(`🕒 ${cronJobs[job].name} started with interval: ${interval}`);
    })
}

const updateCronJobInterval = (job, interval) => {
    if (!cronJobs[job]) {
        logger.error(`❌ ${job} not found`);
        return;
    }

    cronJobs[job].interval = interval;
    startCronJobs();
}

module.exports = {
    startCronJobs,
    updateCronJobInterval,
    CRON_INTERVAL
}