const { USER_ROLES } = require("../configs/user.config");
const { ForbiddenRequestError } = require("../core/responses/error.response");

const checkRoles = ({ requiredRoles }) => {
  return (req, res, next) => {
    try {
      const userRole = req.role;
      if (!Array.isArray(requiredRoles)) {
        throw new Error("requiredRoles must be an array");
      }
      if (!requiredRoles.includes(userRole)) {
        throw new ForbiddenRequestError(
          "You are not allowed to access this resource"
        );
      }
      next();
    } catch (error) {
      throw error;
    }
  };
};
const checkUserOrAdmin = (req,res,next) => {
  try {
    const {id} = req.params;
    const userId = req.userId
    const role = req.role;

    if (role === USER_ROLES.ADMIN || userId === id) {
      return next();
    }
    throw new ForbiddenRequestError("YOu are not allowed to update this user")
  } catch (error) {
    next(error)
  }
}
module.exports = {checkRoles,checkUserOrAdmin};
