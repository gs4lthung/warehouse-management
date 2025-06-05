const getLogger = require("../utils/logger");
const chalk = require("chalk");

const handleApiRequest = (req, res, next) => {
  const logger = getLogger("API_REQUEST");
  // Capture the start time to calculate response time later
  const startTime = new Date();
  const methodColor =
    req.method === "GET"
      ? chalk.green
      : req.method === "POST"
      ? chalk.yellow
      : req.method === "PUT"
      ? chalk.blue
      : req.method === "PATCH"
      ? chalk.magenta
      : req.method === "DELETE"
      ? chalk.redBright
      : req.method === "HEAD"
      ? chalk.hex("#FFA500")
      : req.method === "OPTIONS"
      ? chalk.hex("#FF4500")
      : chalk.white;
  const coloredMethod = methodColor(req.method);

  // Listen for the response to finish so we can log details after it's sent
  res.on("finish", () => {
    if (req.originalUrl.includes("favicon.ico")) {
      return;
    }

    const statusColor =
      res.statusCode < 300
        ? chalk.green
        : res.statusCode < 500
        ? chalk.red
        : chalk.white;
    const coloredStatusCode = statusColor(res.statusCode);

    const duration = new Date() - startTime;
    const logMessage = `🌐 ${req.ip} ${coloredMethod} ${
      req.originalUrl
    } ${req.protocol.toUpperCase()}/${req.httpVersion} ${coloredStatusCode} ${
      res.get("Content-Length") || 0
    } ${req.get("User-Agent")} ${chalk.yellow(duration + "ms")}`;
    logger.info(logMessage);
    logger.info(`🌐 ${chalk.yellow("Query")}: ${JSON.stringify(req.query)}`);
    logger.info(`🌐 ${chalk.yellow("Body")}: ${JSON.stringify(req.body)}`);
  });
  next();
};

module.exports = { handleApiRequest };
