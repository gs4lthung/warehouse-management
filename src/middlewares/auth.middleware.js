const { UnauthorizedRequestError } = require("../core/responses/error.response");
const getLogger = require("../utils/logger");
const logger = getLogger("AUTH_MIDDLEWARE");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const AuthMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new UnauthorizedRequestError("Authorization header is required");
    }
    // logger.info(`Authorization: ${authorization}`);

    const token = authorization.split(" ")[1];
    const { _id, role } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // logger.info(`User ID: ${_id}`);
    // logger.info(`Role: ${role}`);

    req.userId = _id;
    req.role = role;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedRequestError("Token is expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new UnauthorizedRequestError("Token is invalid");
    }
    throw error;
  }
};

module.exports = AuthMiddleware;
