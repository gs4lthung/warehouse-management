const lodash = require("lodash");
const getLogger = require("../utils/logger");
const getInfoData = ({ fields = [], object = {} }) => {
  return lodash.pick(object, fields);
};
const path = require("path");
const errorModel = require("../models/error.model");

require("dotenv").config();

const handleErrorResponse = async (error, req, res, next) => {
  const logger = getLogger("ERROR");
  const statusCode = error.status || 500;

  // Get the stack trace
  const stack = error.stack || "";

  // Parse stack trace to extract file and function information
  const match = stack.match(/\s+at (\S+) \((.*):(\d+):(\d+)\)/);
  const functionName = match ? match[1] : "Unknown function";
  const filePath = match ? match[2] : "Unknown file";
  const fileName = path.basename(filePath);

  const logMessage = `
   ❌ An error occurred in the application
   Code: ${statusCode}
   Message: ${error.message}
   File: ${fileName}
   Function: ${functionName}
   Stack Trace:
   ${stack}
   `;
  logger.error(logMessage);

  if (process.env.NODE_ENV !== "dev") {
    try {
      const errorData = {
        code: error.status?.toString() || "500",
        message: error.message,
        file: fileName,
        function: functionName,
        stackTrace: stack,
      };

      await errorModel.create(errorData);
      logger.info("❌ Error data saved to database");
    } catch (error) {
      logger.error("❌ Error saving error data to database", error);
    }
  }

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
};

module.exports = { getInfoData, handleErrorResponse };
