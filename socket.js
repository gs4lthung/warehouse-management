require("dotenv").config();

const getLogger = require("./src/utils/logger");
const logger = getLogger("SOCKET.IO");
const chalk = require("chalk");

const EventEmitter = require("events");
const errorModel = require("./src/models/error.model");
const notifyModel = require("./src/models/notify.model");
const eventEmitter = new EventEmitter();

let onlineUsers = new Map();

const socket = (io) => {
    if (io.listeners("connection").length > 0) {
        console.log(io.listeners("connection").length);
        return; // Prevent duplicate listeners
    }

    const socketPath = io._path
    logger.info("⚡ Socket.io is running at " + chalk.magenta(chalk.underline(`${process.env.APP_BASE_URL}${socketPath}`)));

    io.on("connection", (socket) => {
        logger.info("⚡ A user connected");

        socket.on("disconnecting", () => {
            logger.info("⚡ A user is disconnecting");
        });
        socket.on("disconnect", () => {
            onlineUsers.forEach((value, key) => {
                if (value === socket.id) {
                    onlineUsers.delete(key);
                    logger.info(`⚡User ${key} has disconnected`);
                }
            })
            logger.info("⚡ A user disconnected");
        });
        socket.on("error", async (error) => {
            logger.error(error);
            await errorModel.create({
                code: "SOCKET_ERROR",
                message: error,
                file: "socket.js",
                function: "socket.on('error')",
                stackTrace: "Error in socket.io",
            })
        });

        socket.on("login", async (userId) => {
            onlineUsers.set(userId, socket.id);
            await getUnreadNotifications(userId, socket);
            logger.info(`⚡User ${userId} is online`);
        })

        // eventEmitter.on("checkAlmostExpiredMedicine", async (almostExpiredMedicines) => {
        //     socket.emit("almostExpiredMedicines", almostExpiredMedicines);
        // })

        // eventEmitter.on("checkExpiredMedicine", async (expiredMedicines) => {
        //     socket.emit("expiredMedicines", expiredMedicines);
        // })

        // eventEmitter.on("checkStockRequestDate", async (stockRequests) => {
        //     socket.emit("stockRequestsExceedDeadline", stockRequests);
        // })

        // eventEmitter.on("checkOutputRequestDate", async (outputRequests) => {
        //     socket.emit("outputRequestsExceedDeadline", outputRequests);
        // })
    });
}

const notifyUser = async ({io, userId, task, navigatePage, type }) => {
    const userSocketId = onlineUsers.get(userId);
    const data = { navigatePage: navigatePage, task: task, type: type };
    logger.info(`⚡Notify user ${userId} with task ${task}`);
    if (userSocketId) {
        io?.to(userSocketId).emit("taskAssigned", data);
    } else {
        await notifyModel.create({
            userId: userId,
            task: task,
            navigatePage: navigatePage,
            type: type,
            isRead: false,
        });
    }
}

const getUnreadNotifications = async (userId, socket) => {
    const notificationHolders = await notifyModel.find({ userId: userId, isRead: false });

    notificationHolders.forEach((notificationHolder) => {
        socket.emit("taskAssigned", { navigatePage: notificationHolder.navigatePage, task: notificationHolder.task, type: notificationHolder.type });
    })

    await notifyModel.updateMany({ userId: userId, isRead: false }, { isRead: true });
}


module.exports = { eventEmitter, socket, notifyUser };  