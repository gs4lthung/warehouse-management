const jwt = require("jsonwebtoken");
require("dotenv").config();

const createAccessToken = (attributes, secret, expiresIn) => {
  return jwt.sign(attributes, secret, {
    expiresIn: expiresIn,
  });
};

module.exports = { createAccessToken };
