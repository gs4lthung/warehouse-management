const rateLimit = require("express-rate-limit");

const rateLimiter = (time, max) => {
  return rateLimit({
    windowMs: time * 60 * 1000, // time in minutes
    max: max, // limit each IP to max requests in windowMs time
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: `Too many requests from this IP, please try again after ${time} minutes`,
  });
};
module.exports = rateLimiter;