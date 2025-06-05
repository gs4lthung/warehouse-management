const { default: mongoose } = require("mongoose");
const os = require("os");
const getLogger = require("../utils/logger");
const chalk = require("chalk");
require("dotenv").config();

const logger = getLogger("CHECK_CONNECTION");
const _SECONDS = parseInt(process.env.CHECK_CONNECTION_INTERVAL) * 1000;

const countConnect = () => {
  const numConnections = mongoose.connections.length;
  return numConnections;
};

const checkOverload = () => {
  setInterval(() => {
    const numConnections = countConnect();
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024;

    logger.info(
      `Memory usages: ${chalk.yellow(
        memoryUsage.toFixed(2)
      )} MB, Connections: ${chalk.yellow(numConnections)}`
    );
    const maxConnections = numCores * 5;
    if (numConnections > maxConnections) {
      logger.warn(
        `Overload, number of connections is exceed ${chalk.red(maxConnections)}`
      );
    }
  }, _SECONDS);
};

module.exports = { countConnect, checkOverload };
