const chalk = require("chalk");
const app = require("./src/app");
const getLogger = require("./src/utils/logger");
const logger = getLogger("SERVER");

const PORT = process.env.NODE_ENV === "dev" ? process.env.DEV_APP_PORT : process.env.PRO_APP_PORT;

const server = app.listen(PORT, () => {
  logger.info(
    `🚀 Server is running at ${chalk.magenta(
      chalk.underline(`${process.env.APP_BASE_URL}/api/v1`)
    )}`
  );
});

// Function to gracefully close the server
const gracefulShutdown = async (signal) => {
  logger.info(chalk.bgGreen(`Received ${signal}. Closing server...`));

  server.close(() => {
    logger.info(chalk.bgWhite("✅ Server closed successfully"));
    process.exit(0);
  });

  // Force exit if the server doesn't close in 10 seconds
  setTimeout(() => {
    logger.warn(chalk.bgYellow("⚠️ Server is taking too long to close..."));
  }, 5000);

  setTimeout(() => {
    logger.error(chalk.bgRed("❌ Server took too long to close. Forcefully exiting..."));
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle uncaught exceptions (unexpected errors)
process.on("uncaughtException", (error) => {
  logger.error(chalk.bgRed("🔥 Uncaught Exception! Shutting down..."), error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error(chalk.bgRed("🚨 Unhandled Promise Rejection! Shutting down..."), reason);
  process.exit(1);
});
