const winston = require("winston");
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf, colorize, prettyPrint } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const getLogger = (customLabel) => {
  return createLogger({
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      label({ label: customLabel }),
      prettyPrint(),
      logFormat
    ),
    transports: [
      new transports.Console({
        format: combine(colorize(), logFormat),
      }),
    ],
  });
};

module.exports = getLogger;